<div align="center">

# 🎓 EduMonitor AI

### AI-Powered College Management System for a Smarter Tomorrow

*One platform. Three perspectives. Every academic decision, backed by data and AI.*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](#license)

[Overview](#-overview) • [Features](#-features) • [Tech Stack](#️-tech-stack) • [Screenshots](#-screenshots) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Roadmap](#-roadmap)

</div>

---

## 📖 Overview

**EduMonitor AI** is a full-stack, AI-augmented College ERP dashboard that unifies academics, attendance, placements, and institutional analytics into a single platform — with dedicated, purpose-built experiences for **Students**, **Faculty**, and **Administrators**.

Instead of being just another data-entry system, EduMonitor bakes **Google Gemini** directly into the workflow: it predicts placement readiness, flags at-risk students before they fall behind, drafts lesson plans and quizzes for faculty, and coaches students through resumes, interviews, and career planning — all from context the platform already has.

> Built as a hands-on exploration of production-style full-stack architecture: role-based access control, JWT authentication, a document-oriented data model, and LLM integration patterns (prompt engineering, structured JSON output, and graceful AI fallback).

---

## ✨ Features

### 👨‍🎓 Student Portal
- **Personal Dashboard** — SGPA, CGPA, attendance %, credits earned, placement readiness score, live timetable, and a semester performance trend chart
- **Academics** — Attendance summary, results, study materials, assignment tracker with due-date alerts
- **AI Career Coach** — A conversational assistant for study plans, resume reviews, interview prep, and certification recommendations
- **Career Tools** — Five dedicated AI modules:
  - 🎯 **Placement Predictor** — role-fit match probability against real job profiles
  - 📊 **Skill Gap Analysis** — missing skills for a target role
  - 📄 **Resume Optimizer** — ATS scoring with an interactive resume draft
  - 💬 **Interview Prep** — auto-generated technical/HR/behavioral questions with model answers
  - 🏢 **Company Matches** — recommended companies based on department, CGPA, and skills

### 👨‍🏫 Faculty Workspace
- **Class Health Dashboard** — AI-generated "Class Health Score," today's schedule, class performance distribution, and pending-grading alerts
- **Attendance Register** — bulk "Mark All Present," per-class daily attendance logging
- **Assignment Center** — create, publish, and track assignments per course
- **Results & Grades** — instructor scoring matrix for internal marks and practical scores
- **Student Performance & Risk Analysis** — per-mentee CGPA/attendance view with an AI-run *Mentorship Matrix & Placement Prediction*, plus one-click **Issue Early Warning** and **Generate AI Academic Report** actions
- **AI Teaching Assistant** — chat-based generation of quizzes, assignments, lesson plans, rubrics, and class-wide risk analysis
- **File Management** — organized library for lecture notes, PPTs, assignments, and research files

### 🏢 Admin Command Center
- **Institution Health Score** — AI-generated summary of attendance trends, at-risk student counts, and placement season readiness
- **University Academic Analytics** — department-wise strength, GPA, and attendance visualizations
- **Student & Faculty Management** — full CRUD with department/semester filtering
- **Placement Predictor Analyzer** — corporate hiring-suitability simulation across the entire student cohort, with eligibility forecasts per student
- **Results & Analytics**, **Departments**, **Courses**, **Fees**, **Certificates**, **Documents**
- **Academic Calendar** — exams, project deadlines, placement drives, and faculty meetings in one view
- **AI University Insights**, notices, approvals queue, and system alerts

### 🔐 Cross-Cutting
- Role-based portals (Admin / Faculty / Student) behind a single authenticated shell
- JWT-secured sessions with automatic logout on token expiry
- Consistent design system across all three portals (shared header, calendar, profile, and AI assistant components)

---

## 🖼️ Screenshots

> Add your captured screenshots to `docs/screenshots/` using the file names below, and they'll render here automatically.

| Landing Page | Portal Selection | Login |
|---|---|---|
| ![Landing](docs/screenshots/landing.png) | ![Portals](docs/screenshots/portal-preview.png) | ![Login](docs/screenshots/login.png) |

| Student Dashboard | Faculty Dashboard | Admin Dashboard |
|---|---|---|
| ![Student Dashboard](docs/screenshots/student-dashboard.png) | ![Faculty Dashboard](docs/screenshots/faculty-dashboard.png) | ![Admin Dashboard](docs/screenshots/admin-dashboard.png) |

| AI Career Coach | AI Teaching Assistant | Placement Predictor |
|---|---|---|
| ![AI Career Coach](docs/screenshots/ai-career-coach.png) | ![AI Teaching Assistant](docs/screenshots/ai-teaching-assistant.png) | ![Placement Predictor](docs/screenshots/placement-predictor.png) |

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- React 19 + TypeScript
- Vite (build tool & dev server)
- TailwindCSS v4 (utility-first styling)
- `recharts` — analytics & performance charts
- `motion` (Framer Motion) — UI transitions
- `lucide-react` — iconography
- `axios` — API communication with JWT interceptors

</td>
<td valign="top" width="50%">

**Backend**
- FastAPI (Python) — REST API + auto-generated OpenAPI docs
- Uvicorn — ASGI server
- MongoDB (Atlas) via `pymongo`
- `python-jose` + `passlib`/`bcrypt` — JWT auth & password hashing
- `pydantic` — request/response schema validation
- Google Gemini (`google-generativeai`) — AI insight generation

</td>
</tr>
</table>

**Architecture pattern (backend):** `routes/` → `controllers/` → `services/` → `repositories/` / `schemas/` / `models/` — a clean separation between HTTP handling, business logic, and data access.

---

## 📁 Project Structure

```
EduMonitor-AI/
├── backend/
│   ├── app.py                 # FastAPI entrypoint, CORS, router registration
│   ├── config/                # Database connection (MongoDB)
│   ├── routes/                # API endpoints (auth, student, faculty, dashboard, placement, ai, erp)
│   ├── controllers/            # Request handling & orchestration
│   ├── services/               # Business logic, Gemini integration, analytics
│   ├── repositories/            # Data access layer
│   ├── schemas/                # Pydantic request/response models
│   ├── models/                 # Domain models
│   ├── prompts/                # Gemini prompt templates (career, resume, interview, company)
│   ├── middleware/              # JWT auth middleware
│   ├── datasets/                # Seed CSVs (marks, placements, students)
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/          # AdminPortal, FacultyPortal, StudentPortal, PlacementPortal, LandingPage
│   │   ├── pages/                # Login, Register
│   │   ├── services/             # API clients (auth, student, faculty, placement, AI)
│   │   ├── context/               # Auth context
│   │   ├── hooks/                  # useAuth
│   │   └── types.ts
│   ├── package.json
│   └── vite.config.ts
│
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.9+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Google Gemini API key](https://ai.google.dev/)

### 1. Clone the repository
```bash
git clone https://github.com/lipikaparida-web/EduMonitor-AI.git
cd EduMonitor-AI
```

### 2. Backend setup (FastAPI)
```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside `backend/` with:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/edumonitor_ai
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Start the API server:
```bash
uvicorn app:app --reload --port 8000
```
Backend runs at → `http://127.0.0.1:8000` (interactive docs at `/docs`)

### 3. Frontend setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at → `http://localhost:3000`

> If you want the frontend to talk to a backend running elsewhere, set `VITE_API_BASE_URL` in a `frontend/.env` file.

---

## 🌍 Deployment

This is a decoupled architecture, deployed as two independent services:

| Layer | Suggested Host | Notes |
|---|---|---|
| Backend (FastAPI) | Render / Railway / Heroku | Set `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY` as environment variables |
| Frontend (Vite/React) | Vercel / Netlify | Set `VITE_API_BASE_URL` to your live backend URL, and update backend CORS to allow your deployed frontend origin |

---

## 🗺️ Roadmap

- [ ] Real-time notifications via WebSockets
- [ ] Faculty ↔ Student direct messaging
- [ ] Mobile-responsive portal layouts
- [ ] Automated placement drive matching & shortlisting
- [ ] Expanded admin analytics (year-over-year trends, cohort comparisons)

---

## 👥 Team & Acknowledgments

This project was built as part of an academic internship under the guidance of **Prof. Ms. Ashwini Sengar**, **Vishwakarma University, Pune**.

**Group 1 — AI-Enabled College Dashboard for Academic Performance Monitoring**

| Team Member | Contribution |
|---|---|
| Lipika Parida | Frontend Development + API Integration |
| Shaurya Ahire | Backend Development + Database + API Integration |
| Snigdha Bishal | EDA + Feature Engineering + Prediction Models | Documentation |
| Vaishali Singh | Data Collection + EDA + Feature Engineering + Prediction Models | Documentation |
| Zoha Bahlooli | EDA + Feature Engineering | Documentation |

---

<div align="center">

Made with care by Group 1, as part of our internship at Vishwakarma University, Pune.

**[⬆ back to top](#-edumonitor-ai)**

</div>
