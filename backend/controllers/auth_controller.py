from fastapi import HTTPException, status

from schemas.login import LoginRequest, RefreshTokenRequest
from schemas.register import RegisterRequest
from services.auth_service import (
    authenticate_user,
    create_user,
    get_user_by_email,
    public_user,
    users_exist,
)
from utils.jwt import create_access_token, create_refresh_token, decode_token


ADMIN_ROLES = {"super_admin", "admin"}


def register_user(payload: RegisterRequest, current_user=None):
    if users_exist():
        # Commented out for demo purposes to allow public registration
        # if not current_user or current_user.get("role") not in ADMIN_ROLES:
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="Only Admin or Super Admin can create users",
        #     )
        pass
    elif payload.role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="First user must be a Super Admin",
        )

    user = create_user(payload)
    return {
        "message": "User registered successfully",
        "user": user,
    }


def login_user(payload: LoginRequest):
    user = authenticate_user(payload.email, payload.password, payload.role)
    token_data = {
        "sub": user["email"],
        "role": user["role"],
        "user_id": user["user_id"],
    }

    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "role": user["role"],
        "name": user["name"],
        "email": user["email"],
        "user_id": user["user_id"],
        "linked_record_id": user.get("linked_record_id"),
    }


def refresh_access_token(payload: RefreshTokenRequest):
    decoded = decode_token(payload.refresh_token)
    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user = get_user_by_email(decoded.get("sub", ""))
    if not user or user.get("status") != "active":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    token_data = {
        "sub": user["email"],
        "role": user["role"],
        "user_id": user["user_id"],
    }

    return {
        "access_token": create_access_token(token_data),
        "token_type": "bearer",
    }


def me(current_user):
    return public_user(current_user)
