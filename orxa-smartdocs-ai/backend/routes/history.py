from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_db

history_bp = Blueprint("history", __name__)

@history_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM file_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
        (user_id,)
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows]), 200

@history_bp.route("/dashboard-stats", methods=["GET"])
@jwt_required()
def dashboard_stats():
    user_id = get_jwt_identity()
    conn = get_db()
    user = conn.execute("SELECT ai_usage_count, files_processed, plan FROM users WHERE id = ?", (user_id,)).fetchone()
    recent = conn.execute(
        "SELECT * FROM file_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
        (user_id,)
    ).fetchall()
    conn.close()
    return jsonify({
        "files_processed": user["files_processed"] if user else 0,
        "ai_usage_count": user["ai_usage_count"] if user else 0,
        "plan": user["plan"] if user else "free",
        "recent_files": [dict(r) for r in recent]
    }), 200
