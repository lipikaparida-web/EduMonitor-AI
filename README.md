# 🎓 EduMonitor AI - College Dashboard

EduMonitor AI is an advanced, AI-powered college ERP and student analytics dashboard. It bridges the gap between academic performance, faculty intervention, and career placement using Google's Gemini AI. 

This platform consists of dedicated portals for **Students**, **Faculty**, and **Administrators**, providing actionable insights, resume evaluation, placement readiness scoring, and smart scheduling.

## ✨ Key Features

- 👨‍🎓 **Student Portal**: View academic standing, attendance, and receive AI-driven personalized study roadmaps.
- 👨‍🏫 **Faculty Portal**: Monitor student progress, get AI alerts for struggling students, and manage class schedules.
- 🏢 **Admin Dashboard**: Overview of college analytics, placement statistics, and faculty performance.
- 🤖 **AI-Powered Placement Predictor**: Evaluates a student's profile against target roles and provides a "Fitment Rating".
- 📄 **Smart Resume Evaluation**: Grades student resumes for ATS compliance and provides missing keywords.
- 🎙️ **Mock Interview Prep**: Generates tailored technical and behavioral interview questions based on the student's exact skill set.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, TailwindCSS, Framer Motion, Recharts
- **Backend**: Python, FastAPI
- **Database**: MongoDB (Atlas)
- **AI Engine**: Google Gemini API (gemini-3.5-flash)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (3.9+)
- MongoDB Atlas cluster
- Google Gemini API Key

### 1. Backend Setup (FastAPI)

Navigate to the backend directory:
```bash
cd backend
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory and add your credentials:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0...
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Start the FastAPI server:
```bash
uvicorn app:app --reload --port 8000
```
*The backend will now run on http://127.0.0.1:8000*

### 2. Frontend Setup (React/Vite)

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install NPM dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```
*The app will now be accessible at http://localhost:5173*

## 🌍 Deployment Guide

This project features a decoupled architecture, so it must be deployed as two separate services:

1. **Backend Deployment**: Deploy the `backend` folder to a service like **Render**, **Heroku**, or **Railway**. Be sure to set `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY` in your hosting provider's environment variables.
2. **Frontend Deployment**: Deploy the `frontend` folder as a static site to **Vercel** or **Netlify**. Before building, add an environment variable `VITE_API_BASE_URL` pointing to your live backend URL (e.g., `https://your-backend.onrender.com`).

---
*Built with ❤️ using React, FastAPI, and Google Gemini.*
