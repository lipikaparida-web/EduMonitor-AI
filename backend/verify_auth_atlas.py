import sys

from config.database import ping_mongo
from controllers.auth_controller import login_user, register_user
from schemas.login import LoginRequest
from schemas.register import RegisterRequest
from services.auth_service import users_collection, users_exist


TEST_EMAIL = "codex.auth.verify@college.edu"
TEST_PASSWORD = "Verify@12345"
TEST_USER_ID = "VERIFY_SUPER_ADMIN"


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    ping_mongo()
    users_collection.delete_many({
        "$or": [
            {"email": TEST_EMAIL},
            {"user_id": TEST_USER_ID},
        ]
    })

    has_users = users_exist()
    payload = RegisterRequest(
        user_id=TEST_USER_ID,
        name="Codex Auth Verify",
        email=TEST_EMAIL,
        password=TEST_PASSWORD,
        role="super_admin",
        status="active",
    )
    current_user = {
        "user_id": "VERIFY_EXISTING_ADMIN",
        "name": "Verify Existing Admin",
        "email": "verify-existing-admin@college.edu",
        "role": "super_admin",
        "status": "active",
    } if has_users else None

    print(f"users_exist(): {has_users}")
    print(f"payload.role: {payload.role}")
    print(f"current_user: {current_user}")

    register_response = register_user(payload, current_user=current_user)

    login_response = login_user(
        LoginRequest(
            email=TEST_EMAIL,
            password=TEST_PASSWORD,
            role="super_admin",
        )
    )

    assert register_response["user"]["email"] == TEST_EMAIL
    assert register_response["user"]["role"] == "super_admin"
    assert login_response["access_token"]
    assert login_response["refresh_token"]
    assert login_response["role"] == "super_admin"

    users_collection.delete_many({
        "$or": [
            {"email": TEST_EMAIL},
            {"user_id": TEST_USER_ID},
        ]
    })

    print("✅ Atlas auth verification passed: register + login + cleanup")


if __name__ == "__main__":
    main()
