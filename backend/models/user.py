from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


UserRole = Literal[
    "super_admin",
    "admin",
    "faculty",
    "student",
    "placement_officer",
]


class User(BaseModel):
    user_id: str = Field(..., min_length=2)
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    role: UserRole
    status: Literal["active", "inactive"] = "active"
    linked_record_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
