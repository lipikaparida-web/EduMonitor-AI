from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from models.student import Student
from config.database import db
from middleware.auth import get_current_user, require_roles
from controllers.student_controller import (
    add_student,
    get_students,
    get_student,
    update_student,
    delete_student,
)

router = APIRouter(tags=["Students"])

students_collection = db["students"]
class_assignments_collection = db["class_assignments"]
notifications_collection = db["notifications"]

@router.post("/students")
def create_student(student: Student, current_user=Depends(require_roles(["super_admin", "admin"]))):
    return add_student(student)

@router.get("/students")
def read_students(current_user=Depends(require_roles(["super_admin", "admin"]))):
    return get_students()

@router.get("/students/{student_id}")
def read_student(student_id: str, current_user=Depends(require_roles(["super_admin", "admin"]))):
    return get_student(student_id)

@router.put("/students/{student_id}")
def edit_student(student_id: str, student: Student, current_user=Depends(require_roles(["super_admin", "admin"]))):
    return update_student(student_id, student)

@router.delete("/students/{student_id}")
def remove_student(student_id: str, current_user=Depends(require_roles(["super_admin", "admin"]))):
    return delete_student(student_id)


def _serialize_student(document: dict) -> dict:
    document["id"] = str(
        document.get("_id")
        or document.get("id")
        or document.get("roll_no")
        or document.get("user_id")
        or document.get("email")
        or ""
    )
    document.pop("_id", None)

    if "attendance" in document and "attendanceRate" not in document:
        document["attendanceRate"] = float(document.get("attendance", 0))

    if "skills" in document and "technicalSkills" not in document:
        document["technicalSkills"] = document.get("skills", [])

    if "soft_skills" in document and "softSkills" not in document:
        document["softSkills"] = document.get("soft_skills", [])

    if "placement_status" in document and "placementStatus" not in document:
        document["placementStatus"] = document.get("placement_status")

    if "resume_url" in document and "resumeUrl" not in document:
        document["resumeUrl"] = document.get("resume_url")

    if "career_goal" in document and "careerGoal" not in document:
        document["careerGoal"] = document.get("career_goal")

    if "earlyWarningAlert" not in document:
        document["earlyWarningAlert"] = document.get(
            "early_warning_alert",
            {"type": "none", "severity": "stable", "details": ""},
        )

    if "assignmentCompletion" not in document:
        document["assignmentCompletion"] = document.get("assignmentCompletion", 0)

    if "subjects" not in document:
        document["subjects"] = []

    if "historySGPA" not in document:
        document["historySGPA"] = []

    return document


def _get_student_timetable(student: dict) -> list[dict]:
    query = {
        "department": student.get("department"),
        "semester": student.get("semester"),
    }
    if student.get("division"):
        query["division"] = student.get("division")

    schedule = []
    for assignment in class_assignments_collection.find(query):
        subject_code = assignment.get("subject_code") or assignment.get("subject", {}).get("code", "")
        subject_name = assignment.get("subject_name") or assignment.get("subject", {}).get("name", "")
        for slot in assignment.get("timetable", []):
            schedule.append(
                {
                    "day": slot.get("day", ""),
                    "time": slot.get("time", ""),
                    "subject_code": subject_code,
                    "subject_name": subject_name,
                    "room": slot.get("room") or assignment.get("room", ""),
                }
            )

    return sorted(schedule, key=lambda item: (item.get("day", ""), item.get("time", "")))


def _build_default_placement_predictions(student: dict) -> list[dict]:
    cgpa = float(student.get("cgpa") or 0)
    attendance = float(student.get("attendanceRate") or student.get("attendance") or 0)
    base_score = min(98, max(40, int((cgpa / 10) * 100)))
    if attendance < 75:
        base_score = max(30, base_score - 15)

    return [
        {
            "role": "Software Development Engineer (SDE)",
            "probability": base_score,
            "status": "Eligible with Prep" if base_score >= 65 else "Needs Skill Upgrade",
            "reason": "Strong academic performance with room to sharpen role-specific coding depth.",
            "missingSkills": ["System Design", "Complex Data Structures", "Debugging at Scale"],
            "recommendedCertifications": ["AWS Cloud Practitioner", "Data Structures & Algorithms"],
        },
        {
            "role": "Data Analyst",
            "probability": min(100, base_score + 5),
            "status": "Highly Likely" if cgpa >= 7.5 else "Eligible with Prep",
            "reason": "Good analytical base with strong academic coursework. Add SQL and statistics practice.",
            "missingSkills": ["SQL", "Power BI", "Probability"],
            "recommendedCertifications": ["Google Data Analytics", "Microsoft Power BI"],
        },
    ]


def _get_student_notifications(current_user: dict) -> list[dict]:
    query = {
        "$or": [
            {"audience": "all"},
            {"audience": "student"},
            {"recipient_email": current_user.get("email")},
        ]
    }
    notifications = []
    for item in notifications_collection.find(query).sort("created_at", -1).limit(5):
        item["id"] = str(item["_id"])
        item.pop("_id", None)
        notifications.append(item)
    return notifications


def _get_student_profile(current_user: dict) -> dict:
    query = {"email": current_user["email"]}
    if current_user.get("linked_record_id"):
        try:
            query = {"_id": ObjectId(current_user["linked_record_id"])}
        except Exception:
            query = {"email": current_user["email"]}

    student = students_collection.find_one(query)
    if not student:
        student = {
            "roll_no": current_user.get("user_id") or current_user.get("email"),
            "name": current_user.get("name") or "Student",
            "email": current_user.get("email"),
            "department": "Computer Science",
            "academic_year": "2025-2026",
            "semester": 1,
            "division": "A",
            "cgpa": 0.0,
            "attendance": 0.0,
            "skills": [],
            "certifications": [],
            "projects": [],
            "resume_url": "",
            "career_goal": "",
            "placement_status": "Active",
            "strengths": [],
            "weaknesses": [],
            "soft_skills": [],
            "softSkills": [],
            "extracurriculars": [],
            "subjects": [],
            "historySGPA": [],
            "internships": [],
            "codingProfiles": [],
            "placementPredictions": [],
            "earlyWarningAlert": {"type": "none", "severity": "stable", "details": ""},
            "assignmentCompletion": 0,
            "timetable": [],
            "notifications": [],
            "fees": [],
        }
        inserted = students_collection.insert_one({**student, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()})
        student["id"] = str(inserted.inserted_id)
        if not current_user.get("linked_record_id"):
            users_collection = db["users"]
            users_collection.update_one(
                {"email": current_user.get("email")},
                {"$set": {"linked_record_id": student["id"]}},
            )
    else:
        student = _serialize_student(student)

    if not student.get("timetable"):
        student["timetable"] = _get_student_timetable(student)

    if not student.get("placementPredictions"):
        student["placementPredictions"] = _build_default_placement_predictions(student)

    if not student.get("historySGPA"):
        semester_count = int(student.get("semester", 1))
        student["historySGPA"] = [
            {"semester": idx + 1, "sgpa": round(5.5 + idx * 0.4 + min(1.5, (student.get("cgpa", 0) / 10)), 2)}
            for idx in range(min(max(1, semester_count), 8))
        ]

    if "notifications" not in student:
        student["notifications"] = _get_student_notifications(current_user)

    if "fees" not in student:
        student["fees"] = [
            {"category": "Tuition Fees", "amount": 15000, "paid": 12500, "dueDate": "2026-08-15", "status": "Due"},
            {"category": "Lab Fees", "amount": 3200, "paid": 3200, "dueDate": "2026-07-10", "status": "Paid"},
            {"category": "Library Fees", "amount": 1200, "paid": 0, "dueDate": "2026-08-01", "status": "Due"},
        ]

    return student


@router.get("/student/profile")
def student_profile(current_user=Depends(require_roles(["student"]))):
    return _get_student_profile(current_user)


@router.put("/student/profile")
def update_student_profile(payload: dict, current_user=Depends(require_roles(["student"]))):
    profile = _get_student_profile(current_user)
    allowed = {
        "name",
        "department",
        "academic_year",
        "semester",
        "division",
        "cgpa",
        "attendance",
        "skills",
        "certifications",
        "projects",
        "resume_url",
        "career_goal",
        "placement_status",
        "strengths",
        "weaknesses",
        "soft_skills",
        "extracurriculars",
    }
    update = {key: value for key, value in payload.items() if key in allowed}
    if update:
        students_collection.update_one(
            {"_id": ObjectId(profile["id"])},
            {"$set": {**update, "updated_at": datetime.utcnow()}},
        )
    return _get_student_profile(current_user)


@router.get("/student/attendance")
def student_attendance(current_user=Depends(require_roles(["student"]))):
    profile = _get_student_profile(current_user)
    return {
        "student_id": profile["id"],
        "attendance": profile.get("attendance", profile.get("attendanceRate", 0)),
        "timetable": profile.get("timetable", []),
    }


@router.get("/student/results")
def student_results(current_user=Depends(require_roles(["student"]))):
    profile = _get_student_profile(current_user)
    return {
        "student_id": profile["id"],
        "cgpa": profile.get("cgpa", 0),
        "semester": profile.get("semester"),
        "subjects": profile.get("subjects", []),
        "historySGPA": profile.get("historySGPA", []),
    }


@router.get("/student/projects")
def student_projects(current_user=Depends(require_roles(["student"]))):
    profile = _get_student_profile(current_user)
    return {
        "student_id": profile["id"],
        "projects": profile.get("projects", []),
        "certifications": profile.get("certifications", []),
        "internships": profile.get("internships", []),
    }
