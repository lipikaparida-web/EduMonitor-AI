from datetime import datetime

from config.database import db
from utils.password import hash_password


DEFAULT_USERS = [
    {
        "user_id": "SA001",
        "name": "Super Admin",
        "email": "superadmin@college.edu",
        "password": "SuperAdmin@123",
        "role": "super_admin",
    },
    {
        "user_id": "ADM001",
        "name": "Admin",
        "email": "admin@college.edu",
        "password": "Admin@12345",
        "role": "admin",
    },
    {
        "user_id": "FAC001",
        "name": "Faculty",
        "email": "faculty@college.edu",
        "password": "Faculty@12345",
        "role": "faculty",
    },
    {
        "user_id": "STU001",
        "name": "Student",
        "email": "student@college.edu",
        "password": "Student@12345",
        "role": "student",
    },
    {
        "user_id": "PLC001",
        "name": "Placement Officer",
        "email": "placement@college.edu",
        "password": "Placement@12345",
        "role": "placement_officer",
    },
]


def seed_users():
    users_collection = db["users"]
    created = 0
    updated = 0

    for user in DEFAULT_USERS:
        email = user["email"].lower()
        document = {
            "user_id": user["user_id"],
            "name": user["name"],
            "email": email,
            "password": hash_password(user["password"]),
            "role": user["role"],
            "status": "active",
            "linked_record_id": None,
            "created_at": datetime.utcnow(),
        }

        result = users_collection.update_one(
            {"email": email},
            {"$set": document},
            upsert=True,
        )

        if result.upserted_id:
            created += 1
        else:
            updated += 1

    return created, updated


if __name__ == "__main__":
    created_count, updated_count = seed_users()
    print(f"Auth users ready. Created: {created_count}, Updated: {updated_count}")
