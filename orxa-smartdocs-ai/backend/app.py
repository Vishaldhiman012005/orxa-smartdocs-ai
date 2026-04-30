from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database import init_db
from routes.auth import auth_bp
from routes.pdf_tools import pdf_bp
from routes.ai_tools import ai_bp
from routes.history import history_bp
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}}, supports_credentials=True)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "orxa-super-secret-key-change-in-prod")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024  # 50MB

jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(pdf_bp, url_prefix="/api")
app.register_blueprint(ai_bp, url_prefix="/api")
app.register_blueprint(history_bp, url_prefix="/api")

@app.route("/")
def home():
    return {"status": "Orxa SmartDocs AI Backend Running", "version": "1.0.0"}

if __name__ == "__main__":
    init_db()
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("outputs", exist_ok=True)
    app.run(debug=os.getenv("FLASK_DEBUG", "true").lower() == "true", port=5000)
