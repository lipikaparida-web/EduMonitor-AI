from pydantic import BaseModel
from typing import List

class InterviewRequest(BaseModel):
    skills: List[str]
    projects: List[str]
    career_goal: str