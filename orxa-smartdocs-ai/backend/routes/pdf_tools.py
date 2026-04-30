from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from database import get_db
import os, uuid, zipfile
from reportlab.lib.pagesizes import A4, A5, letter, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
import fitz
from PIL import Image as PILImage

pdf_bp = Blueprint("pdf", __name__)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "docx", "doc"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def log_history(user_id, filename, original_name, operation, file_size=0):
    conn = get_db()
    conn.execute(
        "INSERT INTO file_history (user_id, filename, original_name, operation, file_size) VALUES (?, ?, ?, ?, ?)",
        (user_id, filename, original_name, operation, file_size)
    )
    conn.execute("UPDATE users SET files_processed = files_processed + 1 WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()

PAGE_SIZES = {"A4": A4, "A5": A5, "Letter": letter}

ALIGNMENTS = {
    "left": TA_LEFT,
    "center": TA_CENTER,
    "right": TA_RIGHT,
    "justify": TA_JUSTIFY
}

FONTS = {
    "Helvetica": "Helvetica",
    "Times": "Times-Roman",
    "Courier": "Courier",
}

@pdf_bp.route("/create-pdf", methods=["POST"])
@jwt_required()
def create_pdf():
    user_id = get_jwt_identity()
    data = request.form

    title = data.get("title", "")
    content = data.get("content", "")
    filename = secure_filename(data.get("filename", "document")) or "document"
    page_size_key = data.get("page_size", "A4")
    orientation = data.get("orientation", "portrait")
    custom_width = data.get("custom_width", "")
    custom_height = data.get("custom_height", "")
    margin = float(data.get("margin", 20))
    font_size = int(data.get("font_size", 12))
    font_style = data.get("font_style", "Helvetica")
    text_align = data.get("text_align", "left")

    image_files = request.files.getlist("images")
    if not image_files:
        one_image = request.files.get("image")
        if one_image:
            image_files = [one_image]

    if custom_width and custom_height:
        try:
            pagesize = (float(custom_width) * mm, float(custom_height) * mm)
        except:
            pagesize = A4
    else:
        pagesize = PAGE_SIZES.get(page_size_key, A4)
        if orientation == "landscape":
            pagesize = landscape(pagesize)

    out_filename = f"{filename}_{uuid.uuid4().hex[:8]}.pdf"
    out_path = os.path.join(OUTPUT_FOLDER, out_filename)

    m = margin * mm
    doc = SimpleDocTemplate(
        out_path,
        pagesize=pagesize,
        leftMargin=m,
        rightMargin=m,
        topMargin=m,
        bottomMargin=m
    )

    font_name = FONTS.get(font_style, "Helvetica")
    align = ALIGNMENTS.get(text_align, TA_LEFT)

    title_style = ParagraphStyle(
        "TitleStyle",
        fontName=font_name,
        fontSize=font_size + 6,
        alignment=TA_CENTER,
        spaceAfter=12,
        textColor=colors.HexColor("#0a0f1e")
    )

    body_style = ParagraphStyle(
        "BodyStyle",
        fontName=font_name,
        fontSize=font_size,
        alignment=align,
        spaceAfter=8,
        leading=font_size * 1.5,
        textColor=colors.HexColor("#1a1a2e")
    )

    story = []

    for image_file in image_files:
        if image_file and allowed_file(image_file.filename):
            ext = image_file.filename.rsplit(".", 1)[1].lower()
            img_path = os.path.join(UPLOAD_FOLDER, f"img_{uuid.uuid4().hex}.{ext}")
            image_file.save(img_path)

            try:
                img = RLImage(img_path, width=120 * mm, height=80 * mm, kind="proportional")
                story.append(img)
                story.append(Spacer(1, 12))
            except:
                pass

    if title:
        story.append(Paragraph(title, title_style))
        story.append(Spacer(1, 12))

    if content:
        for para in content.split("\n"):
            if para.strip():
                story.append(Paragraph(para.strip(), body_style))
            else:
                story.append(Spacer(1, 6))

    doc.build(story)

    file_size = os.path.getsize(out_path)
    log_history(user_id, out_filename, f"{filename}.pdf", "create_pdf", file_size)

    return jsonify({"filename": out_filename, "message": "PDF created successfully"}), 200

@pdf_bp.route("/merge-pdf", methods=["POST"])
@jwt_required()
def merge_pdf():
    user_id = get_jwt_identity()
    files = request.files.getlist("files")

    if len(files) < 2:
        return jsonify({"error": "At least 2 PDF files required"}), 400

    merged = fitz.open()

    for f in files:
        if not allowed_file(f.filename):
            continue

        tmp_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4().hex}.pdf")
        f.save(tmp_path)

        src = fitz.open(tmp_path)
        merged.insert_pdf(src)
        src.close()

        try:
            os.remove(tmp_path)
        except:
            pass

    out_filename = f"merged_{uuid.uuid4().hex[:8]}.pdf"
    out_path = os.path.join(OUTPUT_FOLDER, out_filename)

    merged.save(out_path)
    merged.close()

    file_size = os.path.getsize(out_path)
    log_history(user_id, out_filename, "merged.pdf", "merge_pdf", file_size)

    return jsonify({"filename": out_filename, "message": "PDFs merged successfully"}), 200

@pdf_bp.route("/split-pdf", methods=["POST"])
@jwt_required()
def split_pdf():
    user_id = get_jwt_identity()
    file = request.files.get("file")
    pages_input = request.form.get("pages", "")

    if not file or not allowed_file(file.filename):
        return jsonify({"error": "Valid PDF required"}), 400

    tmp_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4().hex}.pdf")
    file.save(tmp_path)

    src = fitz.open(tmp_path)
    total_pages = len(src)

    try:
        if pages_input.strip():
            page_nums = []
            for part in pages_input.split(","):
                part = part.strip()
                if "-" in part:
                    a, b = part.split("-")
                    page_nums.extend(range(int(a) - 1, min(int(b), total_pages)))
                else:
                    n = int(part) - 1
                    if 0 <= n < total_pages:
                        page_nums.append(n)
            page_nums = sorted(set(page_nums))
        else:
            page_nums = list(range(total_pages))
    except:
        src.close()
        return jsonify({"error": "Invalid page range"}), 400

    zip_filename = f"split_{uuid.uuid4().hex[:8]}.zip"
    zip_path = os.path.join(OUTPUT_FOLDER, zip_filename)

    with zipfile.ZipFile(zip_path, "w") as zf:
        for pg in page_nums:
            out = fitz.open()
            out.insert_pdf(src, from_page=pg, to_page=pg)

            pg_filename = f"page_{pg + 1}.pdf"
            pg_path = os.path.join(OUTPUT_FOLDER, pg_filename)

            out.save(pg_path)
            out.close()

            zf.write(pg_path, pg_filename)
            os.remove(pg_path)

    src.close()

    try:
        os.remove(tmp_path)
    except:
        pass

    log_history(user_id, zip_filename, file.filename, "split_pdf", os.path.getsize(zip_path))

    return jsonify({"filename": zip_filename, "message": f"Split into {len(page_nums)} pages"}), 200

@pdf_bp.route("/compress-pdf", methods=["POST"])
@jwt_required()
def compress_pdf():
    user_id = get_jwt_identity()
    file = request.files.get("file")

    if not file or not allowed_file(file.filename):
        return jsonify({"error": "Valid PDF required"}), 400

    tmp_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4().hex}.pdf")
    file.save(tmp_path)

    original_size = os.path.getsize(tmp_path)

    out_filename = f"compressed_{uuid.uuid4().hex[:8]}.pdf"
    out_path = os.path.join(OUTPUT_FOLDER, out_filename)

    src = fitz.open(tmp_path)
    src.save(out_path, garbage=4, deflate=True, clean=True)
    src.close()

    try:
        os.remove(tmp_path)
    except:
        pass

    compressed_size = os.path.getsize(out_path)
    ratio = round((1 - compressed_size / original_size) * 100, 1) if original_size > 0 else 0

    log_history(user_id, out_filename, file.filename, "compress_pdf", compressed_size)

    return jsonify({
        "filename": out_filename,
        "message": f"Compressed by {ratio}%",
        "original_size": original_size,
        "compressed_size": compressed_size,
        "ratio": ratio
    }), 200

@pdf_bp.route("/pdf-to-images", methods=["POST"])
@jwt_required()
def pdf_to_images():
    user_id = get_jwt_identity()
    file = request.files.get("file")
    dpi = int(request.form.get("dpi", 150))

    if not file or not allowed_file(file.filename):
        return jsonify({"error": "Valid PDF required"}), 400

    tmp_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4().hex}.pdf")
    file.save(tmp_path)

    src = fitz.open(tmp_path)

    zip_filename = f"images_{uuid.uuid4().hex[:8]}.zip"
    zip_path = os.path.join(OUTPUT_FOLDER, zip_filename)

    with zipfile.ZipFile(zip_path, "w") as zf:
        for i, page in enumerate(src):
            mat = fitz.Matrix(dpi / 72, dpi / 72)
            pix = page.get_pixmap(matrix=mat)

            img_filename = f"page_{i + 1}.png"
            img_path = os.path.join(OUTPUT_FOLDER, img_filename)

            pix.save(img_path)
            zf.write(img_path, img_filename)
            os.remove(img_path)

    page_count = len(src)

    src.close()

    try:
        os.remove(tmp_path)
    except:
        pass

    log_history(user_id, zip_filename, file.filename, "pdf_to_images", os.path.getsize(zip_path))

    return jsonify({
        "filename": zip_filename,
        "message": f"Converted {page_count} pages to images"
    }), 200

@pdf_bp.route("/images-to-pdf", methods=["POST"])
@jwt_required()
def images_to_pdf():
    user_id = get_jwt_identity()
    files = request.files.getlist("files")
    page_size = request.form.get("page_size", "A4")
    orientation = request.form.get("orientation", "portrait")

    if not files:
        return jsonify({"error": "At least one image required"}), 400

    doc = fitz.open()

    for f in files:
        if not f.filename.lower().endswith(("png", "jpg", "jpeg")):
            continue

        tmp_path = os.path.join(
            UPLOAD_FOLDER,
            f"{uuid.uuid4().hex}_{secure_filename(f.filename)}"
        )

        f.save(tmp_path)

        try:
            img = PILImage.open(tmp_path)
            w, h = img.size
            img.close()

            if page_size == "A4":
                if orientation == "portrait":
                    page_w, page_h = 595, 842
                else:
                    page_w, page_h = 842, 595
            elif page_size == "Letter":
                if orientation == "portrait":
                    page_w, page_h = 612, 792
                else:
                    page_w, page_h = 792, 612
            else:
                page_w, page_h = w, h

            margin = 20
            rect = fitz.Rect(margin, margin, page_w - margin, page_h - margin)

            page = doc.new_page(width=page_w, height=page_h)
            page.insert_image(rect, filename=tmp_path, keep_proportion=True)

        except Exception as e:
            print(f"Error adding image: {e}")

        finally:
            try:
                os.remove(tmp_path)
            except:
                pass

    if len(doc) == 0:
        doc.close()
        return jsonify({"error": "No valid images found"}), 400

    out_filename = f"images_{uuid.uuid4().hex[:8]}.pdf"
    out_path = os.path.join(OUTPUT_FOLDER, out_filename)

    doc.save(out_path)
    doc.close()

    log_history(user_id, out_filename, "images.pdf", "images_to_pdf", os.path.getsize(out_path))

    return jsonify({
        "filename": out_filename,
        "message": "Images converted to PDF"
    }), 200

@pdf_bp.route("/word-to-pdf", methods=["POST"])
@jwt_required()
def word_to_pdf():
    user_id = get_jwt_identity()
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "Word file required"}), 400

    try:
        from docx import Document

        tmp_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4().hex}.docx")
        file.save(tmp_path)

        docx_file = Document(tmp_path)

        out_filename = f"word_{uuid.uuid4().hex[:8]}.pdf"
        out_path = os.path.join(OUTPUT_FOLDER, out_filename)

        rdoc = SimpleDocTemplate(out_path, pagesize=A4)
        styles = getSampleStyleSheet()

        story = []

        for para in docx_file.paragraphs:
            if para.text.strip():
                story.append(Paragraph(para.text, styles["Normal"]))
                story.append(Spacer(1, 6))

        rdoc.build(story)

        try:
            os.remove(tmp_path)
        except:
            pass

        log_history(user_id, out_filename, file.filename, "word_to_pdf", os.path.getsize(out_path))

        return jsonify({"filename": out_filename, "message": "Word converted to PDF"}), 200

    except Exception as e:
        return jsonify({"error": f"Conversion failed: {str(e)}"}), 500

@pdf_bp.route("/download/<filename>", methods=["GET"])
@jwt_required()
def download_file(filename):
    safe_name = secure_filename(filename)
    file_path = os.path.join(OUTPUT_FOLDER, safe_name)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    return send_file(file_path, as_attachment=True, download_name=safe_name)