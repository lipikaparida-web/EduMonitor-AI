from datetime import datetime
from typing import Any

from bson import ObjectId

from config.database import db
from utils.password import hash_password


faculty_collection = db["faculty"]
users_collection = db["users"]
class_assignments_collection = db["class_assignments"]
subjects_collection = db["subjects"]
timetable_collection = db["timetable"]
students_collection = db["students"]


FACULTY_SEED = [
    {
        "faculty_id": "FAC-001",
        "name": "Dr. Amit Verma",
        "email": "faculty@college.edu",
        "department": "Computer Science",
        "designation": "Professor",
        "qualification": "Ph.D. (Computer Science)",
        "experience": 14,
        "office_hours": "Mon-Fri, 10:00 AM - 12:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
        "subjects": ["CS-301", "CS-302"],
    },
    {
        "faculty_id": "FAC-002",
        "name": "Dr. Priya Nair",
        "email": "priya.nair@college.edu",
        "department": "Computer Science",
        "designation": "Associate Professor",
        "qualification": "M.Tech",
        "experience": 11,
        "office_hours": "Tue-Thu, 01:00 PM - 03:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
        "subjects": ["CS-305"],
    },
    {
        "faculty_id": "FAC-003",
        "name": "Prof. Rahul Singh",
        "email": "rahul.singh@college.edu",
        "department": "Computer Science",
        "designation": "Assistant Professor",
        "qualification": "M.E.",
        "experience": 8,
        "office_hours": "Mon-Wed, 11:00 AM - 01:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
        "subjects": ["CS-401"],
    },
    {
        "faculty_id": "FAC-004",
        "name": "Dr. Meera Joshi",
        "email": "meera.joshi@college.edu",
        "department": "Electronics",
        "designation": "Professor",
        "qualification": "Ph.D.",
        "experience": 13,
        "office_hours": "Mon-Fri, 09:00 AM - 11:00 AM",
        "photo_url": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300",
        "subjects": ["EC-201"],
    },
    {
        "faculty_id": "FAC-005",
        "name": "Prof. Anil Sharma",
        "email": "anil.sharma@college.edu",
        "department": "Mechanical",
        "designation": "Assistant Professor",
        "qualification": "M.Tech",
        "experience": 9,
        "office_hours": "Wed-Fri, 02:00 PM - 04:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300",
        "subjects": ["ME-301"],
    },
    {
        "faculty_id": "FAC-006",
        "name": "Dr. Kavita Rao",
        "email": "kavita.rao@college.edu",
        "department": "Civil",
        "designation": "Professor",
        "qualification": "Ph.D.",
        "experience": 16,
        "office_hours": "Tue-Thu, 09:30 AM - 11:30 AM",
        "photo_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300",
        "subjects": ["CE-201"],
    },
    {
        "faculty_id": "FAC-007",
        "name": "Prof. Suresh Kumar",
        "email": "suresh.kumar@college.edu",
        "department": "Mathematics",
        "designation": "Associate Professor",
        "qualification": "M.Sc.",
        "experience": 12,
        "office_hours": "Mon-Fri, 01:00 PM - 03:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=300",
        "subjects": ["MA-101"],
    },
    {
        "faculty_id": "FAC-008",
        "name": "Dr. Neha Kapoor",
        "email": "neha.kapoor@college.edu",
        "department": "English",
        "designation": "Professor",
        "qualification": "Ph.D.",
        "experience": 10,
        "office_hours": "Tue-Fri, 10:30 AM - 12:30 PM",
        "photo_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300",
        "subjects": ["HS-101"],
    },
    {
        "faculty_id": "FAC-009",
        "name": "Prof. Deepak Bhatia",
        "email": "deepak.bhatia@college.edu",
        "department": "Computer Science",
        "designation": "Assistant Professor",
        "qualification": "M.Tech",
        "experience": 7,
        "office_hours": "Mon-Thu, 12:00 PM - 02:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
        "subjects": ["CS-302"],
    },
    {
        "faculty_id": "FAC-010",
        "name": "Dr. Sneha Kulkarni",
        "email": "sneha.kulkarni@college.edu",
        "department": "Artificial Intelligence",
        "designation": "Associate Professor",
        "qualification": "Ph.D.",
        "experience": 12,
        "office_hours": "Mon-Fri, 03:00 PM - 05:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300",
        "subjects": ["AI-201"],
    },
    {
        "faculty_id": "FAC-011",
        "name": "Prof. Arvind Rao",
        "email": "arvind.rao@college.edu",
        "department": "Computer Science",
        "designation": "Assistant Professor",
        "qualification": "M.E.",
        "experience": 6,
        "office_hours": "Tue-Fri, 11:00 AM - 01:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
        "subjects": ["CS-501"],
    },
    {
        "faculty_id": "FAC-012",
        "name": "Dr. Pooja Iyer",
        "email": "pooja.iyer@college.edu",
        "department": "Computer Science",
        "designation": "Professor",
        "qualification": "Ph.D.",
        "experience": 15,
        "office_hours": "Mon-Fri, 10:00 AM - 12:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300",
        "subjects": ["CS-503"],
    },
    {
        "faculty_id": "FAC-013",
        "name": "Prof. Harish Menon",
        "email": "harish.menon@college.edu",
        "department": "Electronics",
        "designation": "Assistant Professor",
        "qualification": "M.Tech",
        "experience": 8,
        "office_hours": "Wed-Fri, 09:00 AM - 11:00 AM",
        "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
        "subjects": ["EC-301"],
    },
    {
        "faculty_id": "FAC-014",
        "name": "Dr. Ritu Gupta",
        "email": "ritu.gupta@college.edu",
        "department": "Mechanical",
        "designation": "Professor",
        "qualification": "Ph.D.",
        "experience": 14,
        "office_hours": "Mon-Thu, 02:00 PM - 04:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300",
        "subjects": ["ME-401"],
    },
    {
        "faculty_id": "FAC-015",
        "name": "Prof. Nitin Desai",
        "email": "nitin.desai@college.edu",
        "department": "Civil",
        "designation": "Assistant Professor",
        "qualification": "M.Tech",
        "experience": 7,
        "office_hours": "Tue-Fri, 11:30 AM - 01:30 PM",
        "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
        "subjects": ["CE-301"],
    },
    {
        "faculty_id": "FAC-016",
        "name": "Dr. Sangeeta Das",
        "email": "sangeeta.das@college.edu",
        "department": "Mathematics",
        "designation": "Professor",
        "qualification": "Ph.D.",
        "experience": 13,
        "office_hours": "Mon-Fri, 09:00 AM - 11:00 AM",
        "photo_url": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300",
        "subjects": ["MA-201"],
    },
    {
        "faculty_id": "FAC-017",
        "name": "Prof. Manoj Chawla",
        "email": "manoj.chawla@college.edu",
        "department": "English",
        "designation": "Associate Professor",
        "qualification": "M.A.",
        "experience": 9,
        "office_hours": "Mon-Wed, 02:00 PM - 04:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=300",
        "subjects": ["HS-201"],
    },
    {
        "faculty_id": "FAC-018",
        "name": "Dr. Vikas Sharma",
        "email": "vikas.sharma@college.edu",
        "department": "Artificial Intelligence",
        "designation": "Professor",
        "qualification": "Ph.D.",
        "experience": 12,
        "office_hours": "Tue-Fri, 01:00 PM - 03:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300",
        "subjects": ["AI-301"],
    },
    {
        "faculty_id": "FAC-019",
        "name": "Prof. Aditi Malhotra",
        "email": "aditi.malhotra@college.edu",
        "department": "Computer Science",
        "designation": "Assistant Professor",
        "qualification": "M.Tech",
        "experience": 5,
        "office_hours": "Mon-Fri, 04:00 PM - 06:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
        "subjects": ["CS-601"],
    },
    {
        "faculty_id": "FAC-020",
        "name": "Dr. Jayant Patel",
        "email": "jayant.patel@college.edu",
        "department": "Computer Science",
        "designation": "Professor",
        "qualification": "Ph.D.",
        "experience": 17,
        "office_hours": "Mon-Fri, 11:00 AM - 01:00 PM",
        "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
        "subjects": ["CS-602"],
    },
]


SUBJECT_DEFINITIONS = [
    {"code": "CS-301", "name": "Data Structures & Algorithms", "department": "Computer Science", "semester": 6, "lesson_plan": "Arrays, trees, graphs, heaps, recursion."},
    {"code": "CS-302", "name": "Database Management Systems", "department": "Computer Science", "semester": 6, "lesson_plan": "ER modeling, SQL, normalization, transactions."},
    {"code": "CS-305", "name": "Computer Networks", "department": "Computer Science", "semester": 6, "lesson_plan": "TCP/IP, routing, sockets, protocols."},
    {"code": "CS-401", "name": "Operating Systems", "department": "Computer Science", "semester": 7, "lesson_plan": "Processes, scheduling, memory management."},
    {"code": "EC-201", "name": "Digital Electronics", "department": "Electronics", "semester": 3, "lesson_plan": "Logic gates, sequential circuits, flip-flops."},
    {"code": "ME-301", "name": "Thermodynamics", "department": "Mechanical", "semester": 5, "lesson_plan": "Laws of thermodynamics, heat transfer."},
    {"code": "CE-201", "name": "Surveying", "department": "Civil", "semester": 3, "lesson_plan": "Levelling, contouring, traversing."},
    {"code": "MA-101", "name": "Applied Mathematics", "department": "Mathematics", "semester": 1, "lesson_plan": "Calculus, linear algebra, probability."},
    {"code": "HS-101", "name": "Communication Skills", "department": "English", "semester": 1, "lesson_plan": "Presentation, grammar, comprehension."},
    {"code": "AI-201", "name": "Machine Learning Basics", "department": "Artificial Intelligence", "semester": 4, "lesson_plan": "Regression, classification, evaluation metrics."},
    {"code": "CS-501", "name": "Software Engineering", "department": "Computer Science", "semester": 8, "lesson_plan": "SDLC, testing, project management."},
    {"code": "CS-503", "name": "Cloud Computing", "department": "Computer Science", "semester": 8, "lesson_plan": "Containers, virtual machines, orchestration."},
    {"code": "EC-301", "name": "Microprocessors", "department": "Electronics", "semester": 5, "lesson_plan": "Assembly, interfacing, memory systems."},
    {"code": "ME-401", "name": "Machine Design", "department": "Mechanical", "semester": 7, "lesson_plan": "Stress analysis, design considerations."},
    {"code": "CE-301", "name": "Structural Analysis", "department": "Civil", "semester": 5, "lesson_plan": "Loads, deflection, truss analysis."},
    {"code": "MA-201", "name": "Statistics & Probability", "department": "Mathematics", "semester": 2, "lesson_plan": "Hypothesis, regression, distributions."},
    {"code": "HS-201", "name": "Professional Writing", "department": "English", "semester": 2, "lesson_plan": "Technical writing, business correspondence."},
    {"code": "AI-301", "name": "Deep Learning", "department": "Artificial Intelligence", "semester": 6, "lesson_plan": "Neural nets, CNNs, transformers."},
    {"code": "CS-601", "name": "Advanced Database Systems", "department": "Computer Science", "semester": 8, "lesson_plan": "NoSQL, optimization, replication."},
    {"code": "CS-602", "name": "Distributed Systems", "department": "Computer Science", "semester": 8, "lesson_plan": "Consensus, replication, fault tolerance."},
]


TIMETABLE_SLOTS = [
    {"day": "Monday", "time": "09:00-10:00", "room": "B-204"},
    {"day": "Tuesday", "time": "11:00-12:00", "room": "Lab-3"},
    {"day": "Wednesday", "time": "10:00-11:00", "room": "C-101"},
    {"day": "Thursday", "time": "13:00-14:00", "room": "B-205"},
    {"day": "Friday", "time": "14:00-15:00", "room": "A-210"},
]


def _faculty_payload(faculty: dict[str, Any], faculty_id: Any) -> dict[str, Any]:
    return {
        "_id": faculty_id,
        "faculty_id": faculty["faculty_id"],
        "name": faculty["name"],
        "email": faculty["email"],
        "department": faculty["department"],
        "designation": faculty["designation"],
        "qualification": faculty["qualification"],
        "experience": faculty["experience"],
        "office_hours": faculty["office_hours"],
        "photo_url": faculty["photo_url"],
        "subjects": faculty["subjects"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }


def seed_faculty_users_and_assignments() -> dict[str, int]:
    created_faculty = 0
    created_assignments = 0
    created_subjects = 0
    created_timetable = 0

    students_without_division = list(students_collection.find({"division": {"$exists": False}}))
    for index, student in enumerate(students_without_division):
        students_collection.update_one(
            {"_id": student["_id"]},
            {
                "$set": {
                    "division": "A" if index % 2 == 0 else "B",
                    "academic_year": "2025-2026",
                    "roll_no": student.get("roll_no") or student.get("Roll_Number") or f"STU{index + 1:03d}",
                }
            },
        )

    for faculty in FACULTY_SEED:
        faculty_doc = faculty_collection.find_one({"email": faculty["email"]})
        faculty_id = faculty_doc.get("_id") if faculty_doc else ObjectId()
        payload = _faculty_payload(faculty, faculty_id)
        if faculty_doc:
            faculty_collection.update_one({"_id": faculty_id}, {"$set": payload})
        else:
            faculty_collection.insert_one(payload)
            created_faculty += 1

        user_doc = users_collection.find_one({"email": faculty["email"].lower()})
        if not user_doc:
            users_collection.insert_one(
                {
                    "user_id": faculty["faculty_id"],
                    "name": faculty["name"],
                    "email": faculty["email"].lower(),
                    "password": hash_password("Faculty@12345"),
                    "role": "faculty",
                    "status": "active",
                    "linked_record_id": str(faculty_id),
                    "created_at": datetime.utcnow(),
                }
            )
        else:
            users_collection.update_one(
                {"_id": user_doc["_id"]},
                {"$set": {"linked_record_id": str(faculty_id), "role": "faculty", "status": "active"}},
            )

    for subject in SUBJECT_DEFINITIONS:
        existing = subjects_collection.find_one({"code": subject["code"]})
        if existing:
            subjects_collection.update_one({"_id": existing["_id"]}, {"$set": {**subject, "updated_at": datetime.utcnow()}})
        else:
            subjects_collection.insert_one({**subject, "created_at": datetime.utcnow()})
            created_subjects += 1

    for index, faculty in enumerate(FACULTY_SEED):
        faculty_doc = faculty_collection.find_one({"email": faculty["email"]})
        if not faculty_doc:
            continue
        faculty_id = str(faculty_doc["_id"])
        subject_code = faculty["subjects"][0]
        subject_doc = subjects_collection.find_one({"code": subject_code})
        semester = 8 if faculty["department"] == "Computer Science" else subject_doc.get("semester", 8) if subject_doc else 8
        division = "A" if index % 2 == 0 else "B"
        assignment_payload = {
            "class_id": f"{faculty['faculty_id']}-{subject_code}",
            "faculty_id": faculty_id,
            "department": faculty["department"],
            "academic_year": "2025-2026",
            "semester": semester,
            "division": division,
            "subject": {"code": subject_code, "name": subject_doc.get("name") if subject_doc else subject_code},
            "subject_code": subject_code,
            "subject_name": subject_doc.get("name") if subject_doc else subject_code,
            "room": "B-204" if division == "A" else "Lab-2",
            "student_count": students_collection.count_documents({"department": faculty["department"], "semester": semester, "division": division}),
            "timetable": [
                {**slot, "subject_code": subject_code, "subject_name": subject_doc.get("name") if subject_doc else subject_code}
                for slot in TIMETABLE_SLOTS
            ],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        existing_assignment = class_assignments_collection.find_one({"class_id": assignment_payload["class_id"]})
        if existing_assignment:
            class_assignments_collection.update_one({"_id": existing_assignment["_id"]}, {"$set": assignment_payload})
        else:
            class_assignments_collection.insert_one(assignment_payload)
            created_assignments += 1

        subject_doc = subjects_collection.find_one({"code": subject_code})
        if subject_doc:
            timetable_payload = {
                "faculty_id": faculty_id,
                "subject_code": subject_code,
                "day": "Monday",
                "time": "09:00-10:00",
                "room": "B-204",
                "created_at": datetime.utcnow(),
            }
            existing_timetable = timetable_collection.find_one({"faculty_id": faculty_id, "subject_code": subject_code})
            if existing_timetable:
                timetable_collection.update_one({"_id": existing_timetable["_id"]}, {"$set": timetable_payload})
            else:
                timetable_collection.insert_one(timetable_payload)
                created_timetable += 1

    return {
        "faculty": created_faculty,
        "assignments": created_assignments,
        "subjects": created_subjects,
        "timetable": created_timetable,
    }


if __name__ == "__main__":
    result = seed_faculty_users_and_assignments()
    print(f"Faculty seed completed: {result}")
