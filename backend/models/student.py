from typing import Any, List, Optional
from pydantic import BaseModel, EmailStr, Field

class Student(BaseModel):
    roll_no: str
    name: str
    email: EmailStr
    department: str
    academic_year: Optional[str] = None
    semester: int
    division: Optional[str] = None
    cgpa: float
    attendance: float
    skills: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    projects: List[Any] = Field(default_factory=list)
    resume_url: str = ""
    career_goal: str = ""
    placement_status: str = "Active"
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    softSkills: List[str] = Field(default_factory=list)
    extracurriculars: List[str] = Field(default_factory=list)
    subjects: List[Any] = Field(default_factory=list)
    historySGPA: List[Any] = Field(default_factory=list)
    internships: List[Any] = Field(default_factory=list)
    codingProfiles: List[Any] = Field(default_factory=list)
    placementPredictions: List[Any] = Field(default_factory=list)
    earlyWarningAlert: Optional[Any] = Field(default_factory=lambda: {"type": "none", "severity": "stable", "details": ""})
    assignmentCompletion: Optional[float] = 0.0
    timetable: List[Any] = Field(default_factory=list)
    notifications: List[Any] = Field(default_factory=list)
    fees: List[Any] = Field(default_factory=list)
