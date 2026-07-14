from pydantic import BaseModel, EmailStr
from typing import List, Optional

class Faculty(BaseModel):
    faculty_id: str
    name: str
    email: EmailStr
    department: str
    designation: str
    qualification: Optional[str] = None
    experience: int
    office_hours: Optional[str] = None
    photo_url: Optional[str] = None
    subjects: List[str]
