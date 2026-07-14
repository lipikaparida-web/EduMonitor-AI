from datetime import UTC, datetime

from fastapi.testclient import TestClient

from app import app
from config.database import db, ping_mongo
from models.faculty import Faculty
from models.placement import Placement
from models.student import Student
from schemas.register import RegisterRequest
from services.auth_service import create_user, users_collection
from utils.password import hash_password


TEST_SUFFIX = datetime.now(UTC).strftime("%Y%m%d%H%M%S")
TEST_EMAIL = f"crud.verify.{TEST_SUFFIX}@college.edu"
TEST_FACULTY_EMAIL = f"crud.verify.faculty.{TEST_SUFFIX}@college.edu"
TEST_PASSWORD = "CrudVerify@123"


def assert_status(response, expected, label):
    if response.status_code != expected:
        raise AssertionError(f"{label}: expected {expected}, got {response.status_code}: {response.text}")


def main():
    ping_mongo()
    client = TestClient(app)
    token = None
    faculty_token = None
    student_id = None
    faculty_id = None
    placement_id = None

    db["students"].delete_many({"email": {"$regex": r"^crud\.student\."}})
    db["faculty"].delete_many({"email": {"$regex": r"^crud\.faculty\."}})
    db["placements"].delete_many({"company_name": "CRUD Tech"})
    db["faculty_workspaces"].delete_many({"faculty_user_id": {"$regex": r"^CRUD-"}})
    users_collection.delete_many({"email": {"$regex": r"^crud\.verify\."}})

    try:
        create_user(
            RegisterRequest(
                user_id=f"CRUD-{TEST_SUFFIX}",
                name="CRUD Verifier",
                email=TEST_EMAIL,
                password=TEST_PASSWORD,
                role="super_admin",
            )
        )
        create_user(
            RegisterRequest(
                user_id=f"CRUD-FAC-{TEST_SUFFIX}",
                name="CRUD Faculty Verifier",
                email=TEST_FACULTY_EMAIL,
                password=TEST_PASSWORD,
                role="faculty",
            )
        )

        login_response = client.post(
            "/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD, "role": "super_admin"},
        )
        assert_status(login_response, 200, "login")
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        student_payload = Student(
            roll_no=f"ROLL-{TEST_SUFFIX}",
            name="CRUD Student",
            email=f"crud.student.{TEST_SUFFIX}@college.edu",
            department="Computer Science",
            academic_year="SY",
            semester=6,
            division="A",
            cgpa=8.4,
            attendance=91,
            skills=["Python", "React"],
            certifications=["AWS Cloud Practitioner"],
            projects=["ERP Dashboard"],
            resume_url="https://example.com/resume.pdf",
            career_goal="Software Engineer",
            placement_status="Active",
        ).model_dump()
        response = client.post("/students", json=student_payload, headers=headers)
        assert_status(response, 200, "create student")
        student_id = response.json()["id"]
        assert_status(client.get(f"/students/{student_id}", headers=headers), 200, "read student")
        student_payload["cgpa"] = 8.7
        assert_status(client.put(f"/students/{student_id}", json=student_payload, headers=headers), 200, "update student")

        faculty_payload = Faculty(
            faculty_id=f"FAC-{TEST_SUFFIX}",
            name="CRUD Faculty",
            email=f"crud.faculty.{TEST_SUFFIX}@college.edu",
            department="Computer Science",
            designation="Assistant Professor",
            experience=7,
            subjects=["CS-301"],
        ).model_dump()
        response = client.post("/faculty", json=faculty_payload, headers=headers)
        assert_status(response, 200, "create faculty")
        faculty_matches = [
            item for item in client.get("/faculty", headers=headers).json()
            if item.get("email") == faculty_payload["email"]
        ]
        if not faculty_matches:
            raise AssertionError("read faculty: created faculty not returned")
        faculty_id = faculty_matches[0]["_id"]
        faculty_payload["experience"] = 8
        assert_status(client.put(f"/faculty/{faculty_id}", json=faculty_payload, headers=headers), 200, "update faculty")

        placement_payload = Placement(
            company_name="CRUD Tech",
            job_role="Software Engineer",
            location="Bengaluru",
            package=9.5,
            minimum_cgpa=7.0,
            required_skills=["Python", "React"],
            eligible_departments=["Computer Science"],
            deadline="2026-12-31",
            description="Campus drive verification record",
        ).model_dump()
        response = client.post("/placements", json=placement_payload, headers=headers)
        assert_status(response, 200, "create placement")
        placement_id = response.json()["id"]
        assert_status(client.get(f"/placements/{placement_id}", headers=headers), 200, "read placement")
        placement_payload["package"] = 10.0
        assert_status(client.put(f"/placements/{placement_id}", json=placement_payload, headers=headers), 200, "update placement")

        assert_status(client.get("/dashboard", headers=headers), 200, "dashboard")
        assert_status(client.get("/auth/me", headers=headers), 200, "protected me")

        faculty_login_response = client.post(
            "/auth/login",
            json={"email": TEST_FACULTY_EMAIL, "password": TEST_PASSWORD, "role": "faculty"},
        )
        assert_status(faculty_login_response, 200, "faculty login")
        faculty_token = faculty_login_response.json()["access_token"]
        faculty_headers = {"Authorization": f"Bearer {faculty_token}"}
        assert_status(client.get("/students", headers=faculty_headers), 403, "faculty all-students blocked")

        workspace_response = client.get("/faculty/workspace", headers=faculty_headers)
        assert_status(workspace_response, 200, "faculty workspace")
        classes_response = client.get("/faculty/classes", headers=faculty_headers)
        assert_status(classes_response, 200, "faculty classes")
        class_id = classes_response.json()[0]["id"]
        class_students_response = client.get(f"/faculty/classes/{class_id}/students", headers=faculty_headers)
        assert_status(class_students_response, 200, "faculty class students")
        if student_id not in [student.get("id") for student in class_students_response.json()["students"]]:
            raise AssertionError("faculty class students: matching test student not returned")
        assert_status(
            client.post(
                f"/faculty/classes/{class_id}/attendance",
                json={
                    "date": "2026-07-09",
                    "records": [
                        {
                            "student_id": student_id,
                            "student_name": student_payload["name"],
                            "roll_no": student_payload["roll_no"],
                            "status": "Present",
                        }
                    ],
                },
                headers=faculty_headers,
            ),
            200,
            "faculty class attendance bulk save",
        )
        assert_status(
            client.put(
                "/faculty/workspace/profile",
                json={"designation": "Verification Professor", "office_hours": "Mon 10:00-11:00"},
                headers=faculty_headers,
            ),
            200,
            "faculty profile update",
        )
        attendance_response = client.post(
            "/faculty/workspace/attendance",
            json={
                "student_id": student_id,
                "student_name": student_payload["name"],
                "subject_code": "CS-301",
                "date": "2026-07-09",
                "status": "Present",
            },
            headers=faculty_headers,
        )
        assert_status(attendance_response, 200, "faculty attendance create")
        attendance_id = attendance_response.json()["id"]
        assert_status(
            client.put(
                f"/faculty/workspace/attendance/{attendance_id}",
                json={"status": "Absent"},
                headers=faculty_headers,
            ),
            200,
            "faculty attendance update",
        )
        assert_status(
            client.delete(f"/faculty/workspace/attendance/{attendance_id}", headers=faculty_headers),
            200,
            "faculty attendance delete",
        )

        ai_payload = {"student": student_payload, "message": "Give one career recommendation."}
        ai_checks = [
            ("/api/gemini/chat", "text"),
            ("/api/gemini/report", "report"),
            ("/api/gemini/placement", "prediction"),
            ("/api/gemini/resume-eval", "atsScore"),
            ("/api/gemini/interview-prep", "questions"),
            ("/api/gemini/company-recs", "companies"),
        ]
        for path, key in ai_checks:
            response = client.post(path, json=ai_payload, headers=headers)
            assert_status(response, 200, path)
            if key not in response.json():
                raise AssertionError(f"{path}: missing {key} in response")

        print("Atlas CRUD verification passed: students + faculty + placements + dashboard + JWT + AI routes")
    finally:
        if token:
            headers = {"Authorization": f"Bearer {token}"}
            if student_id:
                client.delete(f"/students/{student_id}", headers=headers)
            if faculty_id:
                client.delete(f"/faculty/{faculty_id}", headers=headers)
            if placement_id:
                client.delete(f"/placements/{placement_id}", headers=headers)
        db["students"].delete_many({"email": {"$regex": r"^crud\.student\."}})
        db["faculty"].delete_many({"email": {"$regex": r"^crud\.faculty\."}})
        db["placements"].delete_many({"company_name": "CRUD Tech"})
        db["faculty_workspaces"].delete_many({"faculty_user_id": {"$regex": r"^CRUD-"}})
        users_collection.delete_many({"email": {"$regex": r"^crud\.verify\."}})


if __name__ == "__main__":
    main()
