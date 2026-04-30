from flask import Blueprint, request, jsonify
import fitz
import os
import google.generativeai as genai

ai_bp = Blueprint("ai_bp", __name__)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@ai_bp.route("/ask-pdf", methods=["POST"])
def ask_pdf():
    file = request.files.get("file")
    question = request.form.get("question")
    mode = request.form.get("mode", "ask")

    if not file:
        return jsonify({"error": "PDF required"}), 400

    # PDF read
    doc = fitz.open(stream=file.read(), filetype="pdf")

    text = ""
    for page in doc:
        text += page.get_text()

    doc.close()

    # Gemini AI
    model = genai.GenerativeModel("gemini-2.5-flash")

    model = genai.GenerativeModel("gemini-2.5-flash")

    if mode == "summarize":
        task = "Summarize this PDF in simple English with headings."
    elif mode == "notes":
        task = "Create exam-ready notes from this PDF in simple English."
    elif mode == "points":
        task = "Extract the most important key points from this PDF as bullet points."
    elif mode == "translate":
        task = "Translate the important content of this PDF into Hindi."
    else:
        task = f"Answer this question from the PDF: {question}"

    prompt = f"""
You are an AI PDF assistant.

Task:
{task}

PDF Content:
{text[:15000]}
"""

    response = model.generate_content(prompt)

    return jsonify({
        "answer": response.text
    })