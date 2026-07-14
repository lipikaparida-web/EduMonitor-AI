#!/usr/bin/env python3
import requests
from typing import List, Tuple

BASE = "http://127.0.0.1:8000"

USERS = [
    ("superadmin@college.edu", "SuperAdmin@123", "super_admin"),
    ("admin@college.edu", "Admin@12345", "admin"),
    ("faculty@college.edu", "Faculty@12345", "faculty"),
    ("student@college.edu", "Student@12345", "student"),
    ("placement@college.edu", "Placement@12345", "placement_officer"),
]

ENDPOINTS = [
    ("GET", "/dashboard"),
    ("GET", "/students"),
    ("GET", "/student/profile"),
    ("GET", "/faculty/workspace"),
    ("GET", "/faculty/classes"),
    ("GET", "/placements"),
    ("POST", "/api/gemini/chat"),
    ("POST", "/api/gemini/report"),
    ("POST", "/api/gemini/placement"),
    ("POST", "/api/gemini/resume-eval"),
    ("POST", "/api/gemini/interview-prep"),
    ("POST", "/api/gemini/company-recs"),
]


def try_json(resp: requests.Response) -> Tuple[bool, str]:
    try:
        _ = resp.json()
        return True, "valid JSON"
    except Exception as e:
        return False, f"invalid JSON: {e}"


def login(email: str, password: str, role: str) -> Tuple[bool, dict]:
    url = BASE + "/auth/login"
    payload = {"email": email, "password": password, "role": role}
    try:
        r = requests.post(url, json=payload, timeout=5)
        ok = r.status_code == 200
        return ok, {"status": r.status_code, "body": r.json() if ok else r.text}
    except Exception as e:
        return False, {"error": str(e)}


def call_endpoint(method: str, path: str, token: str = None):
    url = BASE + path
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    try:
        if method == "GET":
            r = requests.get(url, headers=headers, timeout=6)
        else:
            # post minimal payload for gemini endpoints
            payload = {"message": "test", "student": {"name": "Smoke Test", "cgpa": 8}}
            r = requests.post(url, json=payload, headers=headers, timeout=8)
        ok = r.status_code < 400
        is_json, msg = try_json(r) if r.text else (True, "empty body")
        return {"path": path, "method": method, "status": r.status_code, "ok": ok, "json_check": msg}
    except Exception as e:
        return {"path": path, "method": method, "error": str(e)}


def main():
    print("Running backend smoke tests against:", BASE)
    tokens = {}
    for email, pwd, role in USERS:
        ok, res = login(email, pwd, role)
        print(f"LOGIN {email} as {role}:", ok, res if isinstance(res, dict) else str(res))
        if ok and isinstance(res.get("body"), dict):
            tokens[role] = res["body"].get("access_token")

    # Call endpoints with appropriate tokens
    results = []
    for method, path in ENDPOINTS:
        # choose token heuristically
        token = None
        if path.startswith("/dashboard"):
            token = tokens.get("admin") or tokens.get("super_admin")
        elif path.startswith("/students"):
            token = tokens.get("admin") or tokens.get("super_admin")
        elif path.startswith("/student"):
            token = tokens.get("student") or tokens.get("admin")
        elif path.startswith("/faculty"):
            token = tokens.get("faculty") or tokens.get("admin")
        elif path.startswith("/placements"):
            token = tokens.get("placement_officer") or tokens.get("admin")
        else:
            token = tokens.get("admin") or tokens.get("super_admin")

        res = call_endpoint(method, path, token)
        results.append(res)
        print(res)

    # Summary
    errors = [r for r in results if not r.get("ok", True)]
    print("\nSmoke test completed. Endpoints with issues:", len(errors))
    for e in errors:
        print(e)


if __name__ == "__main__":
    main()
