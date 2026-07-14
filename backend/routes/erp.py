from datetime import datetime
from typing import Any, Dict

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from config.database import db
from middleware.auth import get_current_user, require_roles


router = APIRouter(tags=["ERP"])


ADMIN_ROLES = ["super_admin", "admin"]
PLACEMENT_ROLES = ["super_admin", "admin", "placement_officer"]
FACULTY_ROLES = ["super_admin", "admin", "faculty"]

COLLECTION_PERMISSIONS = {
    "departments": {"read": ADMIN_ROLES + ["faculty"], "write": ADMIN_ROLES},
    "courses": {"read": ADMIN_ROLES + ["faculty", "student"], "write": ADMIN_ROLES},
    "subjects": {"read": ADMIN_ROLES + ["faculty", "student"], "write": ADMIN_ROLES},
    "companies": {"read": PLACEMENT_ROLES + ["student"], "write": PLACEMENT_ROLES},
    "events": {"read": ADMIN_ROLES + ["faculty", "student", "placement_officer"], "write": ADMIN_ROLES},
    "notices": {"read": ADMIN_ROLES + ["faculty", "student", "placement_officer"], "write": ADMIN_ROLES},
    "timetable": {"read": ADMIN_ROLES + ["faculty", "student"], "write": ADMIN_ROLES},
    "attendance": {"read": FACULTY_ROLES + ["student"], "write": FACULTY_ROLES},
    "semester_results": {"read": FACULTY_ROLES + ["student"], "write": FACULTY_ROLES},
    "assignments": {"read": FACULTY_ROLES + ["student"], "write": FACULTY_ROLES},
    "projects": {"read": ADMIN_ROLES + ["faculty", "student"], "write": FACULTY_ROLES + ["student"]},
    "certificates": {"read": ADMIN_ROLES + ["faculty", "student"], "write": ADMIN_ROLES + ["faculty"]},
    "internships": {"read": PLACEMENT_ROLES + ["student"], "write": PLACEMENT_ROLES + ["student"]},
    "notifications": {"read": ADMIN_ROLES + ["faculty", "student", "placement_officer"], "write": ADMIN_ROLES},
    "reports": {"read": ADMIN_ROLES + ["faculty", "placement_officer"], "write": ADMIN_ROLES + ["faculty", "placement_officer"]},
    "roles": {"read": ADMIN_ROLES, "write": ["super_admin"]},
    "permissions": {"read": ADMIN_ROLES, "write": ["super_admin"]},
}


class ERPDocument(BaseModel):
    data: Dict[str, Any]


def serialize(document: dict):
    document["id"] = str(document["_id"])
    del document["_id"]
    return document


def ensure_collection(collection: str):
    if collection not in COLLECTION_PERMISSIONS:
        raise HTTPException(status_code=404, detail="ERP collection not found")


def ensure_permission(collection: str, action: str, user: dict):
    ensure_collection(collection)
    allowed_roles = COLLECTION_PERMISSIONS[collection][action]
    if user.get("role") not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized access",
        )


@router.get("/erp/{collection}")
def list_documents(collection: str, current_user=Depends(get_current_user)):
    ensure_permission(collection, "read", current_user)
    return [serialize(document) for document in db[collection].find()]


@router.post("/erp/{collection}")
def create_document(
    collection: str,
    payload: ERPDocument,
    current_user=Depends(get_current_user),
):
    ensure_permission(collection, "write", current_user)
    document = payload.data.copy()
    document["created_at"] = datetime.utcnow()
    document["created_by"] = current_user.get("email")
    result = db[collection].insert_one(document)
    return {
        "message": "Record created successfully",
        "id": str(result.inserted_id),
    }


@router.get("/erp/{collection}/{document_id}")
def get_document(
    collection: str,
    document_id: str,
    current_user=Depends(get_current_user),
):
    ensure_permission(collection, "read", current_user)
    try:
        document = db[collection].find_one({"_id": ObjectId(document_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID")

    if not document:
        raise HTTPException(status_code=404, detail="Record not found")

    return serialize(document)


@router.put("/erp/{collection}/{document_id}")
def update_document(
    collection: str,
    document_id: str,
    payload: ERPDocument,
    current_user=Depends(get_current_user),
):
    ensure_permission(collection, "write", current_user)
    try:
        result = db[collection].update_one(
            {"_id": ObjectId(document_id)},
            {
                "$set": {
                    **payload.data,
                    "updated_at": datetime.utcnow(),
                    "updated_by": current_user.get("email"),
                }
            },
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")

    return {"message": "Record updated successfully"}


@router.patch("/erp/{collection}/{document_id}")
def patch_document(
    collection: str,
    document_id: str,
    payload: ERPDocument,
    current_user=Depends(get_current_user),
):
    return update_document(collection, document_id, payload, current_user)


@router.delete("/erp/{collection}/{document_id}")
def delete_document(
    collection: str,
    document_id: str,
    current_user=Depends(get_current_user),
):
    ensure_permission(collection, "write", current_user)
    try:
        result = db[collection].delete_one({"_id": ObjectId(document_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")

    return {"message": "Record deleted successfully"}


@router.get("/notifications")
def my_notifications(current_user=Depends(get_current_user)):
    role = current_user.get("role")
    email = current_user.get("email")
    query = {
        "$or": [
            {"audience": "all"},
            {"audience": role},
            {"recipient_email": email},
        ]
    }
    return [serialize(document) for document in db["notifications"].find(query)]


@router.get("/companies")
def companies(current_user=Depends(require_roles(PLACEMENT_ROLES + ["student"]))):
    return [serialize(document) for document in db["companies"].find()]
