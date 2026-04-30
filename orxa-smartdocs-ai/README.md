# 🔷 Orxa SmartDocs AI

> AI-powered document creation and PDF tools platform  
> Built with React + Vite + Flask + SQLite + Claude AI

---

## 📦 Project Structure

```
orxa-smartdocs-ai/
├── frontend/               # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/     # Sidebar, Layout, Logo, etc.
│   │   ├── pages/          # All 10 pages
│   │   ├── hooks/          # useAuth context
│   │   └── utils/          # axios API client
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── backend/                # Flask Python API
│   ├── routes/
│   │   ├── auth.py         # Register, Login, Logout, /me
│   │   ├── pdf_tools.py    # All PDF operations
│   │   ├── ai_tools.py     # AI Q&A, summarize, translate
│   │   └── history.py      # File history + dashboard stats
│   ├── app.py              # Flask entry point
│   ├── database.py         # SQLite init
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## ⚡ Quick Setup (VS Code)

### Prerequisites
- Python 3.10+
- Node.js 18+
- VS Code

---

## 🐍 Backend Setup

```bash
cd backend

# 1. Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file
cp .env.example .env
# Edit .env and fill in your values

# 4. Run backend
python app.py
```

Backend runs at: `http://localhost:5000`

---

## ⚛️ Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:5000

# 3. Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔐 Environment Variables

### backend/.env
```env
JWT_SECRET_KEY=your-super-secret-key-change-this
ANTHROPIC_API_KEY=sk-ant-your-key-here
FLASK_DEBUG=true
DB_PATH=orxa.db
```

### frontend/.env
```env
VITE_API_BASE_URL=http://localhost:5000
```

> **Note:** `ANTHROPIC_API_KEY` is optional. If missing, AI features will show a clear message instead of crashing. All PDF tools work without it.

---

## 🧪 Testing Each Feature

### 1. Register & Login
- Visit `http://localhost:5173`
- Click "Get Started" → fill register form
- You'll be redirected to Dashboard automatically

### 2. Create PDF
- Dashboard → Create PDF
- Fill title, content, choose font, page size, orientation
- Click "Generate PDF" → then "Download"

### 3. Merge PDFs
- PDF Tools → Merge PDFs tab
- Upload 2+ PDF files
- Click "Run Merge PDFs" → Download

### 4. Split PDF
- PDF Tools → Split PDF tab
- Upload PDF, optionally enter page range (e.g. `1-3, 5`)
- Download ZIP of split pages

### 5. Compress PDF
- PDF Tools → Compress PDF tab
- Upload PDF → runs compression → shows % saved

### 6. PDF to Images
- PDF Tools → PDF → Images tab
- Choose DPI → Download ZIP of PNG files

### 7. Images to PDF
- PDF Tools → Images → PDF tab
- Upload multiple images → generates PDF

### 8. Word to PDF
- PDF Tools → Word → PDF tab
- Upload .docx file → converts to PDF

### 9. AI Assistant (requires API key)
- AI Assistant page
- Upload PDF → choose mode (Ask, Summarize, Notes, Key Points, Translate)
- View AI response inline

### 10. File History
- History page shows all your processed files
- Download any previous output

---

## 🚀 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build

# Push to GitHub, then:
# 1. Go to vercel.com → New Project → Import GitHub repo
# 2. Framework: Vite
# 3. Root directory: frontend
# 4. Add env var: VITE_API_BASE_URL=https://your-backend.onrender.com
# 5. Deploy
```

### Backend → Render

```bash
# 1. Push full project to GitHub
# 2. Go to render.com → New Web Service → Connect GitHub repo
# 3. Settings:
#    - Root directory: backend
#    - Build command: pip install -r requirements.txt
#    - Start command: gunicorn app:app
# 4. Add environment variables (JWT_SECRET_KEY, ANTHROPIC_API_KEY)
# 5. Deploy
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | No | Create account |
| POST | /api/login | No | Login |
| POST | /api/logout | Yes | Logout |
| GET | /api/me | Yes | Current user |
| PUT | /api/settings | Yes | Update profile |
| POST | /api/create-pdf | Yes | Create PDF |
| POST | /api/merge-pdf | Yes | Merge PDFs |
| POST | /api/split-pdf | Yes | Split PDF |
| POST | /api/compress-pdf | Yes | Compress PDF |
| POST | /api/pdf-to-images | Yes | PDF to images |
| POST | /api/images-to-pdf | Yes | Images to PDF |
| POST | /api/word-to-pdf | Yes | Word to PDF |
| POST | /api/ask-pdf | Yes | AI Q&A |
| POST | /api/summarize-pdf | Yes | AI summarize/notes/points |
| POST | /api/translate-pdf | Yes | AI translate |
| GET | /api/history | Yes | File history |
| GET | /api/dashboard-stats | Yes | Dashboard stats |
| GET | /api/download/<filename> | Yes | Download file |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Flask, Flask-JWT-Extended, Flask-CORS |
| Database | SQLite (via Python sqlite3) |
| Auth | JWT tokens, bcrypt password hashing |
| PDF | PyMuPDF (fitz), ReportLab, python-docx, Pillow |
| AI | Anthropic Claude API |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🎨 Design System

- **Background:** Dark navy `#020817`
- **Accent:** Cyan `#06b6d4` / `#00fff5`
- **Cards:** Glassmorphism with blur + white/5 background
- **Fonts:** Rajdhani (display), Exo 2 (body), JetBrains Mono
- **Animations:** Framer Motion — subtle, smooth, premium

---

## ✅ Security Notes

- Passwords are hashed with Werkzeug (bcrypt)
- JWT tokens expire: configurable via Flask-JWT-Extended
- File uploads validated by extension
- Files are sanitized with `secure_filename`
- API keys are never exposed to frontend
- Each user only sees their own file history

---

© 2025 Orxa SmartDocs AI
