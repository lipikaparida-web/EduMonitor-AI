from pydantic import BaseModel
from typing import List

class Placement(BaseModel):
    company_name: str
    job_role: str
    location: str
    package: float
    minimum_cgpa: float
    required_skills: List[str]
    eligible_departments: List[str]
    deadline: str
    description: str