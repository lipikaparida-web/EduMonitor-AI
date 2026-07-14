from fastapi import HTTPException
from bson import ObjectId
from config.database import db

faculty_collection = db["faculty"]


def add_faculty(faculty):

    faculty_dict = faculty.model_dump()

    existing = faculty_collection.find_one(
        {"email": faculty_dict["email"]}
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Faculty already exists"
        )

    result = faculty_collection.insert_one(faculty_dict)

    return {
        "message": "Faculty added successfully",
        "id": str(result.inserted_id)
    }


def get_faculties():

    faculty = []

    for f in faculty_collection.find():

        f["_id"] = str(f["_id"])

        faculty.append(f)

    return faculty


def get_faculty(faculty_id):

    faculty = faculty_collection.find_one(
        {"_id": ObjectId(faculty_id)}
    )

    if not faculty:
        raise HTTPException(
            status_code=404,
            detail="Faculty not found"
        )

    faculty["_id"] = str(faculty["_id"])

    return faculty


def update_faculty(faculty_id, faculty):

    result = faculty_collection.update_one(
        {"_id": ObjectId(faculty_id)},
        {"$set": faculty.model_dump()}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Faculty not found"
        )

    return {
        "message": "Faculty updated successfully"
    }


def delete_faculty(faculty_id):

    result = faculty_collection.delete_one(
        {"_id": ObjectId(faculty_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Faculty not found"
        )

    return {
        "message": "Faculty deleted successfully"
    }
