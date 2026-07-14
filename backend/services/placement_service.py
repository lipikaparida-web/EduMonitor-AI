import math
from config.database import db
from bson import ObjectId
from fastapi import HTTPException
from services.gemini_service import generate_response

placements_collection = db["placements"]


# -----------------------------
# Helper Function
# -----------------------------
def clean_document(doc):
    for key, value in list(doc.items()):

        if isinstance(value, float):

            if math.isnan(value) or math.isinf(value):
                doc[key] = None

    return doc


# -----------------------------
# CREATE
# -----------------------------
def create_placement(data):

    placement = data.model_dump()

    result = placements_collection.insert_one(placement)

    placement["id"] = str(result.inserted_id)
    placement.pop("_id", None)

    return placement


# -----------------------------
# READ ALL
# -----------------------------
def get_all_placements():

    placements = []

    for placement in placements_collection.find():

        placement["id"] = str(placement["_id"])
        placement.pop("_id", None)

        placement = clean_document(placement)

        placements.append(placement)

    return placements


# -----------------------------
# READ ONE
# -----------------------------
def get_placement_by_id(id):

    try:

        placement = placements_collection.find_one(
            {"_id": ObjectId(id)}
        )

    except:

        raise HTTPException(
            status_code=400,
            detail="Invalid Placement ID"
        )

    if not placement:

        return None

    placement["id"] = str(placement["_id"])
    placement.pop("_id", None)

    placement = clean_document(placement)

    return placement


# -----------------------------
# UPDATE
# -----------------------------
def update_placement(id, data):

    try:

        result = placements_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": data.model_dump()}
        )

    except:

        raise HTTPException(
            status_code=400,
            detail="Invalid Placement ID"
        )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Placement Not Found"
        )

    return {
        "message": "Placement Updated Successfully"
    }


# -----------------------------
# DELETE
# -----------------------------
def delete_placement(id):

    try:

        result = placements_collection.delete_one(
            {"_id": ObjectId(id)}
        )

    except:

        raise HTTPException(
            status_code=400,
            detail="Invalid Placement ID"
        )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Placement Not Found"
        )

    return {
        "message": "Placement Deleted Successfully"
    }


# =====================================================
# AI PLACEMENT PREDICTION
# =====================================================
def placement_prediction(student_id: str):

    placement = placements_collection.find_one(
        {"Student_ID": student_id}
    )

    if not placement:
        raise HTTPException(
            status_code=404,
            detail="Student placement data not found"
        )

    placement = clean_document(placement)

    prompt = f"""
You are an expert AI Career Coach.

Analyze this student's profile and return ONLY valid JSON.

Student ID: {placement.get("Student_ID")}
CGPA: {placement.get("CGPA")}
Skill Level: {placement.get("Skill_Level")}
Primary Domain: {placement.get("Primary_Domain")}
Secondary Domain: {placement.get("Secondary_Domain")}
Programming Languages: {placement.get("Programming_Languages")}
Web Technologies: {placement.get("Web_Technologies")}
Frameworks: {placement.get("Frameworks")}
Databases: {placement.get("Databases")}
Machine Learning Skills: {placement.get("Machine_Learning_Skills")}
Data Science Skills: {placement.get("Data_Science_Skills")}
Cloud Platforms: {placement.get("Cloud_Platforms")}
DevOps Tools: {placement.get("DevOps_Tools")}
Version Control: {placement.get("Version_Control")}
Operating Systems: {placement.get("Operating_Systems")}
Cybersecurity Skills: {placement.get("Cybersecurity_Skills")}
Mobile Development: {placement.get("Mobile_Development")}
Data Visualization: {placement.get("Data_Visualization_Tools")}
Problem Solving Score: {placement.get("Problem_Solving_Score")}
Communication Score: {placement.get("Communication_Score")}
Teamwork Score: {placement.get("Teamwork_Score")}
Leadership Score: {placement.get("Leadership_Score")}
Presentation Skills: {placement.get("Presentation_Skills_Score")}
Analytical Skills: {placement.get("Analytical_Skills_Score")}
Soft Skills: {placement.get("Soft_Skills")}
Certifications: {placement.get("Certifications")}
Hackathons: {placement.get("Hackathons_Participated")}
Projects: {placement.get("Projects_Built")}
Achievements: {placement.get("Achievements")}
Internships: {placement.get("Internship_Experience")}
Languages: {placement.get("Languages_Known")}
Placement Ready: {placement.get("Placement_Ready")}
Expected CTC: {placement.get("Expected_CTC_LPA")}

Return ONLY valid JSON in this format:

{{
    "placement_probability": 0,
    "placement_status": "",
    "strengths": [],
    "weaknesses": [],
    "missing_skills": [],
    "recommended_certifications": [],
    "learning_roadmap": [],
    "career_path": "",
    "expected_package": "",
    "final_advice": ""
}}
"""

    return generate_response(prompt)
