from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


ROLE_ALIASES = {
    "super admin": "super_admin",
    "admin": "admin",
    "faculty": "faculty",
    "student": "student",
    "placement officer": "placement_officer",
}


class RegisterRequest(BaseModel):
    user_id: str = Field(..., min_length=2)
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    role: Literal[
        "super_admin",
        "admin",
        "faculty",
        "student",
        "placement_officer",
    ]
    status: Literal["active", "inactive"] = "active"
    linked_record_id: Optional[str] = None

    @field_validator("role", mode="before")
    @classmethod
    def normalize_role(cls, value):
        if not isinstance(value, str):
            return value

        normalized = value.strip().lower().replace("-", " ").replace("_", " ")
        return ROLE_ALIASES.get(normalized, value)
