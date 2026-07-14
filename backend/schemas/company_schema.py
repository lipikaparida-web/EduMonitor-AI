from pydantic import BaseModel
from typing import List

class CompanyRequest(BaseModel):
    cgpa: float
    department: str
    skills: List[str]