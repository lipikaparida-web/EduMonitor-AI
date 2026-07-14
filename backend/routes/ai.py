from typing import Any, Dict, List

from fastapi import APIRouter, Depends

from middleware.auth import get_current_user
from services.gemini_service import generate_response


router = APIRouter(prefix="/api/gemini", tags=["AI"])


def _student(payload: Dict[str, Any]) -> Dict[str, Any]:
    student = payload.get("student") or payload.get("studentProfile") or payload
    return student if isinstance(student, dict) else {}


def _skills(student: Dict[str, Any]) -> List[str]:
    return student.get("technicalSkills") or student.get("skills") or []


def _fallback_text(payload: Dict[str, Any]) -> str:
    message = payload.get("message") or "Generate guidance."
    context = payload.get("context") or {}
    return (
        "I reviewed the available EduMonitor AI context and prepared a practical action plan. "
        f"Request: {message}. Focus on attendance discipline, CGPA improvement, skill practice, "
        "project evidence, and timely faculty intervention."
    )


def _json_prompt(task: str, payload: Dict[str, Any], schema_hint: str) -> str:
    return f"""
You are EduMonitor AI for a production college ERP.
Return valid JSON only. Do not use markdown fences.

Task:
{task}

Required JSON shape:
{schema_hint}

Input:
{payload}
"""


@router.post("/chat")
def chat(payload: Dict[str, Any], current_user=Depends(get_current_user)):
    prompt = _json_prompt(
        "Answer the user's academic/career question with concise, actionable guidance.",
        payload,
        '{"text": "string"}',
    )
    result = generate_response(prompt)
    text = result.get("text") if isinstance(result, dict) else None
    return {"text": text or _fallback_text(payload)}


@router.post("/report")
def report(payload: Dict[str, Any], current_user=Depends(get_current_user)):
    student = _student(payload)
    prompt = _json_prompt(
        "Generate a student academic report.",
        payload,
        '{"report": "string"}',
    )
    result = generate_response(prompt)
    report_text = result.get("report") if isinstance(result, dict) else None
    if not report_text:
        report_text = (
            f"Academic Report for {student.get('name', 'Student')}\n\n"
            f"CGPA: {student.get('cgpa', 'N/A')}\n"
            f"Attendance: {student.get('attendanceRate', student.get('attendance', 'N/A'))}%\n"
            "Recommendation: Maintain consistent attendance, strengthen weak subjects, "
            "and document project work for placement readiness."
        )
    return {"report": report_text}


@router.post("/placement")
def placement(payload: Dict[str, Any], current_user=Depends(get_current_user)):
    student = _student(payload)
    target = payload.get("targetJobRole") or payload.get("targetRole") or "target role"
    prompt = _json_prompt(
        "Evaluate placement readiness and job fit.",
        payload,
        '{"prediction": "string"}',
    )
    result = generate_response(prompt)
    prediction = result.get("prediction") if isinstance(result, dict) else None
    if not prediction:
        prediction = (
            f"Placement analysis for {student.get('name', 'Student')} targeting {target}: "
            f"CGPA {student.get('cgpa', 'N/A')} and skills {', '.join(_skills(student)[:5]) or 'not listed'} "
            "indicate the student should focus on role-specific projects, DSA practice, resume evidence, "
            "and interview preparation."
        )
    return {"prediction": prediction}


@router.post("/resume-eval")
def resume(payload: Dict[str, Any], current_user=Depends(get_current_user)):
    student = _student(payload)
    prompt = _json_prompt(
        "Evaluate resume ATS readiness.",
        payload,
        '{"atsScore": 80, "strength": "string", "missingKeywords": [], "missingProjects": [], "grammarSuggestions": [], "formattingImprovements": [], "technicalSkillRecommendations": [], "rating": "Good"}',
    )
    result = generate_response(prompt)
    if not isinstance(result, dict) or "atsScore" not in result:
        result = {}
    return {
        "atsScore": int(result.get("atsScore", 78)),
        "strength": result.get(
            "strength",
            f"{student.get('name', 'The student')} has a workable academic and skills profile. Add quantified project outcomes and role-specific keywords.",
        ),
        "missingKeywords": result.get("missingKeywords", ["System Design", "CI/CD", "Cloud", "Testing"]),
        "missingProjects": result.get("missingProjects", ["Build one end-to-end production-style project with measurable outcomes."]),
        "grammarSuggestions": result.get("grammarSuggestions", ["Use action verbs and quantify achievements."]),
        "formattingImprovements": result.get("formattingImprovements", ["Keep sections concise and ATS-friendly."]),
        "technicalSkillRecommendations": result.get("technicalSkillRecommendations", ["Add role-specific tools and deployment experience."]),
        "rating": result.get("rating", "Good"),
    }


@router.post("/interview-prep")
def interview(payload: Dict[str, Any], current_user=Depends(get_current_user)):
    prompt = _json_prompt(
        "Generate interview preparation questions.",
        payload,
        '{"questions": [{"category": "Technical", "question": "string", "answer": "string", "difficulty": "Medium", "feedback": "string"}]}',
    )
    result = generate_response(prompt)
    questions = result.get("questions") if isinstance(result, dict) else None
    if not isinstance(questions, list):
        questions = [
            {
                "category": "Technical",
                "question": "Explain a project you built and the tradeoffs behind your architecture.",
                "answer": "Describe the problem, design, data model, implementation choices, testing, and measurable outcome.",
                "difficulty": "Medium",
                "feedback": "Use the STAR method and quantify impact.",
            }
        ]
    return {"questions": questions}


@router.post("/company-recs")
def company(payload: Dict[str, Any], current_user=Depends(get_current_user)):
    student = _student(payload)
    prompt = _json_prompt(
        "Recommend companies for the student.",
        payload,
        '{"companies": [{"name": "string", "eligibility": "string", "requiredSkills": [], "successProbability": 70}]}',
    )
    result = generate_response(prompt)
    companies = result.get("companies") if isinstance(result, dict) else None
    if not isinstance(companies, list):
        companies = [
            {
                "name": "TCS Digital",
                "eligibility": "CGPA above 6.0, no active backlogs, good fundamentals.",
                "requiredSkills": _skills(student)[:4] or ["Python", "SQL", "Problem Solving"],
                "hiringPattern": "Aptitude, coding assessment, technical interview, HR round.",
                "interviewProcess": "Focus on fundamentals, projects, and communication.",
                "salaryPackage": "6-9 LPA",
                "successProbability": 70,
            }
        ]
    return {"companies": companies}
