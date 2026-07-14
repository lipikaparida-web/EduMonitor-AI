from pydantic import BaseModel
from typing import List

class CareerRequest(BaseModel):
    name: str
    department: str
    semester: int
    cgpa: float
    skills: List[str]
    projects: List[str]
    career_goal: str