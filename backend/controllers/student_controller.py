from fastapi import HTTPException
from bson import ObjectId
from config.database import db

students_collection = db["students"]


def add_student(student):
    student_dict = student.model_dump()

    existing = students_collection.find_one(
        {"email": student_dict["email"]}
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Student already exists"
        )

    result = students_collection.insert_one(student_dict)

    return {
        "message": "Student added successfully",
        "id": str(result.inserted_id)
    }


def get_students():

    students = []

    for student in students_collection.find():

        student["id"] = str(student["_id"])
        del student["_id"]

        students.append(student)

    return students


def get_student(student_id):

    try:
        student = students_collection.find_one(
            {"_id": ObjectId(student_id)}
        )
    except:
        raise HTTPException(
            status_code=400,
            detail="Invalid Student ID"
        )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    student["id"] = str(student["_id"])
    del student["_id"]

    return student


def update_student(student_id, student):

    try:
        result = students_collection.update_one(
            {"_id": ObjectId(student_id)},
            {"$set": student.model_dump()}
        )
    except:
        raise HTTPException(
            status_code=400,
            detail="Invalid Student ID"
        )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "message": "Student updated successfully"
    }


def delete_student(student_id):

    try:
        result = students_collection.delete_one(
            {"_id": ObjectId(student_id)}
        )
    except:
        raise HTTPException(
            status_code=400,
            detail="Invalid Student ID"
        )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "message": "Student deleted successfully"
    }
