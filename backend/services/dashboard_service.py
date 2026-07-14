from config.database import db
import traceback
from statistics import mean
from datetime import date, datetime
from bson import ObjectId

students_collection = db["students"]
faculty_collection = db["faculty"]
placements_collection = db["placements"]
semester_collection = db["semester_results"]
departments_collection = db["departments"]
subjects_collection = db["subjects"]
courses_collection = db["courses"]
attendance_collection = db["attendance"]
companies_collection = db["companies"]


def _normalize_number(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _to_jsonable(value):
    if isinstance(value, dict):
        return {str(key): _to_jsonable(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_to_jsonable(item) for item in value]
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return str(value)


def get_dashboard_data():
    try:
        students = [_to_jsonable(student) for student in list(students_collection.find())]
        faculty = [_to_jsonable(item) for item in list(faculty_collection.find())]
        placements = [_to_jsonable(item) for item in list(placements_collection.find())]
        semesters = [_to_jsonable(item) for item in list(semester_collection.find())]
        departments = [_to_jsonable(item) for item in list(departments_collection.find())]
        subjects = [_to_jsonable(item) for item in list(subjects_collection.find())]
        courses = [_to_jsonable(item) for item in list(courses_collection.find())]
        attendance_records = [_to_jsonable(item) for item in list(attendance_collection.find())]
        companies = [_to_jsonable(item) for item in list(companies_collection.find())]

        valid_students = [student for student in students if isinstance(student, dict)]
        valid_semesters = [semester for semester in semesters if isinstance(semester, dict)]

        department_counts = {}
        for student in valid_students:
            department = student.get("department") or "Unassigned"
            department_counts[department] = department_counts.get(department, 0) + 1

        cgpa_values = [_normalize_number(student.get("cgpa")) for student in valid_students]
        attendance_values = [_normalize_number(student.get("attendance")) for student in valid_students]
        sgpa_values = [_normalize_number(semester.get("SGPA")) for semester in valid_semesters]
        attendance_avg_values = [_normalize_number(semester.get("Attendance_Avg_Pct")) for semester in valid_semesters]
        semester_counts = {}
        for student in valid_students:
            semester = str(student.get("semester") or "Unassigned")
            semester_counts[semester] = semester_counts.get(semester, 0) + 1

        placement_status_counts = {}
        for student in valid_students:
            status = student.get("placement_status") or "Unknown"
            placement_status_counts[status] = placement_status_counts.get(status, 0) + 1

        cgpa_distribution = {
            "0-5": 0,
            "5-6": 0,
            "6-7": 0,
            "7-8": 0,
            "8-9": 0,
            "9-10": 0,
        }
        for value in cgpa_values:
            if value < 5:
                cgpa_distribution["0-5"] += 1
            elif value < 6:
                cgpa_distribution["5-6"] += 1
            elif value < 7:
                cgpa_distribution["6-7"] += 1
            elif value < 8:
                cgpa_distribution["7-8"] += 1
            elif value < 9:
                cgpa_distribution["8-9"] += 1
            else:
                cgpa_distribution["9-10"] += 1

        placement_ready_count = 0
        for placement in placements:
            ready_value = str(placement.get("Placement_Ready") or "").strip().lower()
            if ready_value in {"yes", "y", "true", "placed", "ready"}:
                placement_ready_count += 1

        latest_students = []
        for student in valid_students[:6]:
            student_id = student.get("_id") or student.get("id") or student.get("Roll_Number")
            if hasattr(student_id, "__str__"):
                student_id = str(student_id)
            latest_students.append({
                "id": student_id,
                "name": student.get("name") or "Unknown Student",
                "department": student.get("department") or "Unassigned",
                "cgpa": _normalize_number(student.get("cgpa")),
                "attendance": _normalize_number(student.get("attendance")),
                "placement_status": student.get("placement_status") or "Unknown",
            })

        alerts = []
        for student in valid_students[:4]:
            attendance = _normalize_number(student.get("attendance"))
            cgpa = _normalize_number(student.get("cgpa"))
            if attendance < 75 or cgpa < 6.0:
                alert_id = student.get("_id") or student.get("id") or student.get("name")
                if hasattr(alert_id, "__str__"):
                    alert_id = str(alert_id)
                alerts.append({
                    "id": f"alert-{alert_id}",
                    "studentName": student.get("name") or "Unknown",
                    "department": student.get("department") or "Unassigned",
                    "message": (
                        f"{student.get('name') or 'Student'} needs academic support. "
                        f"Attendance {attendance:.1f}% and CGPA {cgpa:.2f}."
                    ),
                    "severity": "critical" if attendance < 70 or cgpa < 5.5 else "warning",
                    "date": "Today",
                    "status": "active",
                    "type": "academic" if cgpa < 6.0 else "attendance",
                })

        if not alerts:
            alerts.append({
                "id": "system-alert",
                "studentName": "System",
                "department": "Administration",
                "message": "All monitored students are within the expected academic range.",
                "severity": "warning",
                "date": "Today",
                "status": "active",
                "type": "general",
            })

        return {
            "students": len(valid_students),
            "faculty": len(faculty),
            "departments": len(departments) or len(department_counts),
            "subjects": len(subjects),
            "courses": len(courses),
            "placements": len(placements),
            "companies": len(companies),
            "semesters": len(valid_semesters),
            "placement_ready": placement_ready_count,
            "average_cgpa": round(mean(cgpa_values) if cgpa_values else 0.0, 2),
            "average_attendance": round(mean(attendance_values) if attendance_values else 0.0, 2),
            "average_sgpa": round(mean(sgpa_values) if sgpa_values else 0.0, 2),
            "average_semester_attendance": round(mean(attendance_avg_values) if attendance_avg_values else 0.0, 2),
            "department_distribution": [
                {"name": name, "value": count}
                for name, count in sorted(department_counts.items())
            ],
            "semester_distribution": [
                {"name": f"Semester {name}", "value": count}
                for name, count in sorted(semester_counts.items())
            ],
            "placement_statistics": [
                {"name": name, "value": count}
                for name, count in sorted(placement_status_counts.items())
            ],
            "attendance_trend": [
                {
                    "name": item.get("date") or item.get("month") or f"Record {index + 1}",
                    "Attendance": _normalize_number(item.get("attendance") or item.get("Attendance_Avg_Pct")),
                }
                for index, item in enumerate((attendance_records or valid_semesters)[:12])
            ],
            "cgpa_distribution": [
                {"name": name, "value": count}
                for name, count in cgpa_distribution.items()
            ],
            "placement_trend": [
                {
                    "name": placement.get("deadline") or placement.get("company_name") or f"Drive {index + 1}",
                    "Placements": _normalize_number(placement.get("selected") or placement.get("offers") or 0),
                }
                for index, placement in enumerate(placements[:12])
            ],
            "latest_students": latest_students,
            "alerts": alerts,
            "recent_activities": [
                "Student records synchronized from MongoDB Atlas",
                "Dashboard analytics refreshed",
                "Placement and academic alerts evaluated",
            ],
        }

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}
