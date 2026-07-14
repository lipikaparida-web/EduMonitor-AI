from fastapi import APIRouter, Depends

from controllers.auth_controller import (
    login_user,
    me,
    refresh_access_token,
    register_user,
)
from middleware.auth import get_current_user, get_optional_user, require_roles
from schemas.login import LoginRequest, RefreshTokenRequest
from schemas.register import RegisterRequest


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(payload: RegisterRequest, current_user=Depends(get_optional_user)):
    return register_user(payload, current_user)


@router.post("/login")
def login(payload: LoginRequest):
    return login_user(payload)


@router.post("/refresh")
def refresh(payload: RefreshTokenRequest):
    return refresh_access_token(payload)


@router.get("/me")
def current_user(current_user=Depends(get_current_user)):
    return me(current_user)


@router.get("/users")
def list_users(current_user=Depends(require_roles(["super_admin", "admin"]))):
    from services.auth_service import public_user, users_collection

    return [public_user(user) for user in users_collection.find()]
