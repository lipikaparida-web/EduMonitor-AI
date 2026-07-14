#!/usr/bin/env python3
import requests, uuid

BASE = "http://127.0.0.1:8000"

def login(email, password, role):
    r = requests.post(BASE + "/auth/login", json={"email": email, "password": password, "role": role})
    r.raise_for_status()
    return r.json()["access_token"]


def run():
    print("CRUD smoke tests")
    token = login("admin@college.edu", "Admin@12345", "admin")
    headers = {"Authorization": f"Bearer {token}"}

    # Create student
    uniq = str(uuid.uuid4())[:8]
    student_payload = {
        "roll_no": f"R{uniq}",
        "name": f"Smoke Student {uniq}",
        "email": f"smoke-{uniq}@example.com",
        "department": "Computer Science",
        "semester": 1,
        "cgpa": 7.5,
        "attendance": 90,
        "academic_year": "SY",
        "division": "A",
        "skills": ["Python", "SQL"],
        "certifications": [],
        "projects": [],
        "resume_url": "",
        "career_goal": "",
        "placement_status": "Active",
    }

    print("Creating student...")
    r = requests.post(BASE + "/students", json=student_payload, headers=headers)
    print(r.status_code, r.text)
    r.raise_for_status()
    created = r.json()
    sid = created.get("id") or created.get("_id")

    # Read students
    r = requests.get(BASE + "/students", headers=headers)
    print("GET /students", r.status_code)
    r.raise_for_status()

    # Update student
    print("Updating student...")
    update_payload = {**student_payload, "name": f"Updated Smoke {uniq}"}
    r = requests.put(BASE + f"/students/{sid}", json=update_payload, headers=headers)
    print("PUT status", r.status_code)
    r.raise_for_status()

    # Delete student
    print("Deleting student...")
    r = requests.delete(BASE + f"/students/{sid}", headers=headers)
    print("DELETE status", r.status_code)
    r.raise_for_status()

    # Placements CRUD
    placement = {
        "company_name": f"SmokeCo {uniq}",
        "job_role": "Software Engineer",
        "package": 10,
        "minimum_cgpa": 6,
        "eligible_departments": ["Computer Science"],
        "deadline": "2026-12-31",
        "location": "Mumbai",
        "required_skills": ["Python", "DSA"],
        "description": "On-campus drive for software engineers",
    }
    print("Creating placement...")
    r = requests.post(BASE + "/placements", json=placement, headers=headers)
    print(r.status_code, r.text)
    r.raise_for_status()
    pid = r.json().get("id") or r.json().get("_id")

    r = requests.get(BASE + "/placements", headers=headers)
    print("GET /placements", r.status_code)
    r.raise_for_status()

    print("Deleting placement...")
    r = requests.delete(BASE + f"/placements/{pid}", headers=headers)
    print("DELETE placement", r.status_code)
    r.raise_for_status()

    print("CRUD smoke tests completed successfully.")


if __name__ == "__main__":
    run()
