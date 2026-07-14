from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


ROLE_ALIASES = {
    "super admin": "super_admin",
    "super_admin": "super_admin",
    "admin": "admin",
    "faculty": "faculty",
    "student": "student",
    "placement officer": "placement_officer",
    "placement_officer": "placement_officer",
}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)
    role: Literal[
        "super_admin",
        "admin",
        "faculty",
        "student",
        "placement_officer",
    ]

    @field_validator("role", mode="before")
    @classmethod
    def normalize_role(cls, value):
        if not isinstance(value, str):
            return value

        normalized = value.strip().lower().replace("-", " ").replace("_", " ")
        return ROLE_ALIASES.get(normalized, value)


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., min_length=1)
