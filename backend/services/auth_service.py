from datetime import datetime
from typing import Any, Optional

from fastapi import HTTPException, status

from config.database import db
from schemas.register import RegisterRequest
from utils.password import hash_password, verify_password


users_collection = db["users"]


def public_user(user: dict):
    return {
        "id": str(user.get("_id")),
        "user_id": user.get("user_id"),
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user.get("role"),
        "status": user.get("status", "active"),
        "linked_record_id": user.get("linked_record_id"),
        "created_at": user.get("created_at"),
    }


def get_user_by_email(email: str) -> Optional[dict]:
    return users_collection.find_one({"email": email.lower().strip()})


def resolve_user_for_token_identity(token_payload: dict[str, Any]) -> Optional[dict]:
    user_id = str(token_payload.get("user_id") or "").strip()
    email = str(token_payload.get("sub") or "").strip().lower()

    if user_id:
        user = users_collection.find_one({"user_id": user_id})
        if user:
            return user

    if email:
        return get_user_by_email(email)

    return None


def users_exist() -> bool:
    return users_collection.estimated_document_count() > 0


def create_user(data: RegisterRequest):
    email = data.email.lower().strip()

    if users_collection.find_one({"email": email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists",
        )

    if users_collection.find_one({"user_id": data.user_id}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID already exists",
        )

    user_doc = data.model_dump()
    user_doc["email"] = email
    user_doc["password"] = hash_password(data.password)
    user_doc["created_at"] = datetime.utcnow()

    result = users_collection.insert_one(user_doc)
    created = users_collection.find_one({"_id": result.inserted_id})
    return public_user(created)


def authenticate_user(email: str, password: str, role: str):
    user = get_user_by_email(email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.get("role") != role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized role for this account",
        )

    if user.get("status") != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )

    if not verify_password(password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong password",
        )

    return user
