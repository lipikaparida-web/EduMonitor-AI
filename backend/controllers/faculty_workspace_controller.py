from copy import deepcopy
from datetime import datetime
from uuid import uuid4

from fastapi import HTTPException
from bson import ObjectId

from config.database import db


workspace_collection = db["faculty_workspaces"]
faculty_collection = db["faculty"]
class_assignments_collection = db["class_assignments"]
attendance_collection = db["attendance_records"]


DEFAULT_WORKSPACE = {
    "profile": {
        "name": "",
        "email": "",
        "department": "Computer Science",
        "designation": "Assistant Professor",
        "qualification": "M.Tech",
        "experience": 5,
        "office_hours": "Mon-Fri, 2:00 PM - 4:00 PM",
        "photo_url": "",
    },
    "timetable": [
        {"day": "Monday", "time": "09:00-10:00", "subject_code": "CS-301", "room": "B-204"},
        {"day": "Wednesday", "time": "11:00-12:00", "subject_code": "CS-302", "room": "Lab-2"},
        {"day": "Friday", "time": "10:00-11:00", "subject_code": "CS-301", "room": "B-204"},
    ],
    "class_assignments": [
        {
            "id": "seed-class-1",
            "department": "Computer Science",
            "academic_year": "SY",
            "semester": 6,
            "division": "A",
            "subject_code": "CS-301",
            "subject_name": "Data Structures & Algorithms",
            "room": "B-204",
        },
        {
            "id": "seed-class-2",
            "department": "Computer Science",
            "academic_year": "SY",
            "semester": 6,
            "division": "A",
            "subject_code": "CS-302",
            "subject_name": "Database Management Systems",
            "room": "Lab-2",
        },
    ],
    "announcements": [
        {"id": "seed-ann-1", "title": "Internal assessment window", "body": "Upload IA marks before Friday.", "date": "2026-07-08"},
    ],
    "attendance": [],
    "marks": [],
    "subjects": [
        {
            "id": "seed-sub-1",
            "code": "CS-301",
            "name": "Data Structures & Algorithms",
            "materials": [],
            "lesson_plan": "Arrays, linked lists, stacks, queues, trees, graphs.",
            "syllabus_progress": 62,
        },
        {
            "id": "seed-sub-2",
            "code": "CS-302",
            "name": "Database Management Systems",
            "materials": [],
            "lesson_plan": "ER models, SQL, normalization, indexing, transactions.",
            "syllabus_progress": 55,
        },
    ],
    "assignments": [],
    "notices": [],
    "messages": [],
    "reports": [],
}


VALID_SECTIONS = {
    "timetable",
    "announcements",
    "attendance",
    "marks",
    "subjects",
    "assignments",
    "notices",
    "messages",
    "reports",
    "class_assignments",
}


def _owner_query(current_user):
    return {"faculty_user_id": current_user["user_id"]}


def _faculty_id(current_user):
    faculty = get_logged_in_faculty(current_user)
    return faculty["id"]


def _clean(document):
    document["id"] = str(document["_id"])
    document.pop("_id", None)
    return document


def get_logged_in_faculty(current_user):
    linked_record_id = current_user.get("linked_record_id")
    faculty = None

    if linked_record_id:
        try:
            faculty = faculty_collection.find_one({"_id": ObjectId(linked_record_id)})
        except Exception:
            faculty = None

    if not faculty:
        faculty = faculty_collection.find_one({"email": current_user.get("email")})

    if not faculty:
        raise HTTPException(
            status_code=404,
            detail="Faculty record is not linked to this user account",
        )

    return _clean(faculty)


def _assignment_filter(current_user):
    faculty_id = _faculty_id(current_user)
    return {"faculty_id": faculty_id}


def _assignment_to_public(assignment):
    assignment = _clean(assignment)
    subject = assignment.get("subject", {})
    assignment["id"] = assignment.get("class_id") or assignment["id"]
    assignment["subject_code"] = subject.get("code") or assignment.get("subject_code")
    assignment["subject_name"] = subject.get("name") or assignment.get("subject_name")
    assignment["room"] = assignment.get("room") or assignment.get("classroom") or ""
    return assignment


def get_or_create_workspace(current_user):
    faculty = get_logged_in_faculty(current_user)
    assignments = get_assigned_classes(current_user)
    attendance = list(attendance_collection.find({"faculty_id": faculty["id"]}).sort("created_at", -1).limit(300))
    timetable = []
    subjects_by_code = {}

    for assignment in assignments:
        subject_code = assignment.get("subject_code")
        if subject_code:
            subjects_by_code[subject_code] = {
                "id": subject_code,
                "code": subject_code,
                "name": assignment.get("subject_name"),
                "materials": assignment.get("materials", []),
                "lesson_plan": assignment.get("lesson_plan", ""),
                "syllabus_progress": assignment.get("syllabus_progress", 0),
            }
        for slot in assignment.get("timetable", []):
            timetable.append(
                {
                    **slot,
                    "subject_code": subject_code,
                    "subject_name": assignment.get("subject_name"),
                    "class_id": assignment.get("class_id") or assignment.get("id"),
                    "division": assignment.get("division"),
                }
            )

    profile = {
        "name": faculty.get("name"),
        "email": faculty.get("email"),
        "department": faculty.get("department"),
        "designation": faculty.get("designation"),
        "qualification": faculty.get("qualification", ""),
        "experience": faculty.get("experience", 0),
        "office_hours": faculty.get("office_hours", ""),
        "photo_url": faculty.get("photo_url", ""),
    }

    return {
        "id": faculty["id"],
        "faculty_user_id": current_user["user_id"],
        "faculty_record_id": faculty["id"],
        "profile": profile,
        "class_assignments": assignments,
        "timetable": timetable,
        "subjects": list(subjects_by_code.values()),
        "attendance": [_clean(item) for item in attendance],
        "announcements": [],
        "marks": [],
        "assignments": [],
        "notices": [],
        "messages": [],
        "reports": [],
    }


def get_or_create_legacy_workspace(current_user):
    query = _owner_query(current_user)
    workspace = workspace_collection.find_one(query)
    if workspace:
        return _clean(workspace)

    workspace = {
        **deepcopy(DEFAULT_WORKSPACE),
        "faculty_user_id": current_user["user_id"],
        "faculty_email": current_user["email"],
        "profile": {
            **DEFAULT_WORKSPACE["profile"],
            "name": current_user.get("name") or "Faculty",
            "email": current_user.get("email") or "",
        },
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = workspace_collection.insert_one(workspace)
    workspace["_id"] = result.inserted_id
    return _clean(workspace)


def _matches_any(student, keys, expected):
    if expected in (None, ""):
        return True

    normalized_expected = str(expected).strip().lower()
    saw_value = False
    for key in keys:
        value = student.get(key)
        if value is not None:
            saw_value = True
            if str(value).strip().lower() == normalized_expected:
                return True
    if not saw_value and normalized_expected == "a":
        return True
    return False


def _student_to_public(student):
    student["id"] = str(student["_id"])
    student.pop("_id", None)
    student.setdefault("roll_no", student.get("Roll_Number") or student.get("rollNumber") or student.get("Student_ID") or "")
    student.setdefault("department", student.get("Department") or student.get("department") or "")
    student.setdefault("semester", student.get("Semester") or student.get("semester") or 1)
    student.setdefault("division", student.get("Section") or student.get("division") or "A")
    student.setdefault("academic_year", student.get("Admission_Year") or student.get("academic_year") or "")
    return student


def get_assigned_classes(current_user):
    assignments = []
    for assignment in class_assignments_collection.find(_assignment_filter(current_user)):
        assignments.append(_assignment_to_public(assignment))
    assignments.sort(
        key=lambda item: (
            -(int(item.get("student_count") or 0)),
            item.get("department", ""),
            item.get("semester", 0),
            item.get("division", ""),
            item.get("subject_code", ""),
        )
    )
    return assignments


def _get_assignment(current_user, class_id):
    for assignment in get_assigned_classes(current_user):
        if assignment.get("id") == class_id or assignment.get("class_id") == class_id:
            return assignment
    raise HTTPException(status_code=404, detail="Faculty class assignment not found")


def get_students_for_class(current_user, class_id):
    assignment = _get_assignment(current_user, class_id)
    students_collection = db["students"]
    candidates = students_collection.find(
        {
            "$and": [
                {
                    "$or": [
                        {"department": assignment["department"]},
                        {"Department": assignment["department"]},
                    ]
                },
                {
                    "$or": [
                        {"semester": assignment["semester"]},
                        {"Semester": assignment["semester"]},
                    ]
                },
            ],
        }
    )

    students = []
    for student in candidates:
        if not _matches_any(student, ["division", "Division", "Section"], assignment.get("division")):
            continue
        students.append(_student_to_public(student))

    students.sort(key=lambda item: str(item.get("roll_no") or item.get("Roll_Number") or item.get("name") or ""))
    return {
        "class_assignment": assignment,
        "students": students,
        "count": len(students),
    }


def save_class_attendance(current_user, class_id, payload):
    assignment = _get_assignment(current_user, class_id)
    faculty_id = _faculty_id(current_user)
    records = payload.get("records", [])
    if not isinstance(records, list) or not records:
        raise HTTPException(status_code=400, detail="Attendance records are required")

    attendance_date = payload.get("date") or datetime.utcnow().date().isoformat()
    saved_records = []
    for record in records:
        item = {
            "id": str(uuid4()),
            "class_id": class_id,
            "faculty_id": faculty_id,
            "department": assignment.get("department"),
            "academic_year": assignment.get("academic_year"),
            "semester": assignment.get("semester"),
            "division": assignment.get("division"),
            "subject_code": assignment.get("subject_code"),
            "subject_name": assignment.get("subject_name"),
            "date": attendance_date,
            "student_id": record.get("student_id"),
            "student_name": record.get("student_name"),
            "roll_no": record.get("roll_no"),
            "status": record.get("status", "Present"),
            "created_at": datetime.utcnow().isoformat(),
        }
        saved_records.append(item)

    get_or_create_workspace(current_user)
    if saved_records:
        attendance_collection.insert_many(saved_records)
    return {
        "message": "Class attendance saved successfully",
        "saved": len(saved_records),
        "class_assignment": assignment,
    }


def update_profile(current_user, payload):
    faculty = get_logged_in_faculty(current_user)
    allowed = {
        "name",
        "email",
        "department",
        "designation",
        "qualification",
        "experience",
        "office_hours",
        "photo_url",
    }
    update = {key: value for key, value in payload.items() if key in allowed}
    if update:
        faculty_collection.update_one({"_id": ObjectId(faculty["id"])}, {"$set": update})
    return get_logged_in_faculty(current_user)


def add_section_item(current_user, section, payload):
    if section not in VALID_SECTIONS:
        raise HTTPException(status_code=400, detail="Invalid faculty workspace section")

    item = {**payload, "id": payload.get("id") or str(uuid4()), "created_at": datetime.utcnow().isoformat()}
    get_or_create_workspace(current_user)
    workspace_collection.update_one(
        _owner_query(current_user),
        {"$push": {section: item}, "$set": {"updated_at": datetime.utcnow()}},
    )
    return item


def update_section_item(current_user, section, item_id, payload):
    if section not in VALID_SECTIONS:
        raise HTTPException(status_code=400, detail="Invalid faculty workspace section")

    workspace = get_or_create_workspace(current_user)
    items = workspace.get(section, [])
    updated_items = []
    found = False

    for item in items:
        if item.get("id") == item_id:
            updated_items.append({**item, **payload, "id": item_id, "updated_at": datetime.utcnow().isoformat()})
            found = True
        else:
            updated_items.append(item)

    if not found:
        raise HTTPException(status_code=404, detail="Workspace item not found")

    workspace_collection.update_one(
        _owner_query(current_user),
        {"$set": {section: updated_items, "updated_at": datetime.utcnow()}},
    )
    return next(item for item in updated_items if item.get("id") == item_id)


def delete_section_item(current_user, section, item_id):
    if section not in VALID_SECTIONS:
        raise HTTPException(status_code=400, detail="Invalid faculty workspace section")

    workspace_collection.update_one(
        _owner_query(current_user),
        {"$pull": {section: {"id": item_id}}, "$set": {"updated_at": datetime.utcnow()}},
    )
    return {"message": "Workspace item deleted successfully"}
