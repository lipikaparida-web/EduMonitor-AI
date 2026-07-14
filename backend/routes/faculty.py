from typing import Any, Dict

from fastapi import APIRouter, Depends

from models.faculty import Faculty

from controllers.faculty_controller import (
    add_faculty,
    get_faculties,
    get_faculty,
    update_faculty,
    delete_faculty
)
from controllers.faculty_workspace_controller import (
    add_section_item,
    delete_section_item,
    get_assigned_classes,
    get_or_create_workspace,
    get_students_for_class,
    save_class_attendance,
    update_profile,
    update_section_item,
)
from middleware.auth import require_roles

router = APIRouter(
    tags=["Faculty"]
)


@router.post("/faculty")
def create_faculty(faculty: Faculty, current_user=Depends(require_roles(["super_admin", "admin"]))):
    return add_faculty(faculty)


@router.get("/faculty")
def read_faculty(current_user=Depends(require_roles(["super_admin", "admin", "faculty"]))):
    return get_faculties()


@router.get("/faculty/workspace")
def faculty_workspace(current_user=Depends(require_roles(["faculty", "super_admin", "admin"]))):
    return get_or_create_workspace(current_user)


@router.get("/faculty/classes")
def faculty_classes(current_user=Depends(require_roles(["faculty", "super_admin", "admin"]))):
    return get_assigned_classes(current_user)


@router.get("/faculty/classes/{class_id}/students")
def faculty_class_students(class_id: str, current_user=Depends(require_roles(["faculty", "super_admin", "admin"]))):
    return get_students_for_class(current_user, class_id)


@router.post("/faculty/classes/{class_id}/attendance")
def faculty_class_attendance(
    class_id: str,
    payload: Dict[str, Any],
    current_user=Depends(require_roles(["faculty", "super_admin", "admin"])),
):
    return save_class_attendance(current_user, class_id, payload)


@router.put("/faculty/workspace/profile")
def save_faculty_profile(payload: Dict[str, Any], current_user=Depends(require_roles(["faculty", "super_admin", "admin"]))):
    return update_profile(current_user, payload)


@router.post("/faculty/workspace/{section}")
def create_faculty_workspace_item(
    section: str,
    payload: Dict[str, Any],
    current_user=Depends(require_roles(["faculty", "super_admin", "admin"])),
):
    return add_section_item(current_user, section, payload)


@router.put("/faculty/workspace/{section}/{item_id}")
def save_faculty_workspace_item(
    section: str,
    item_id: str,
    payload: Dict[str, Any],
    current_user=Depends(require_roles(["faculty", "super_admin", "admin"])),
):
    return update_section_item(current_user, section, item_id, payload)


@router.delete("/faculty/workspace/{section}/{item_id}")
def remove_faculty_workspace_item(
    section: str,
    item_id: str,
    current_user=Depends(require_roles(["faculty", "super_admin", "admin"])),
):
    return delete_section_item(current_user, section, item_id)


@router.get("/faculty/{faculty_id}")
def read_one_faculty(faculty_id: str, current_user=Depends(require_roles(["super_admin", "admin", "faculty"]))):
    return get_faculty(faculty_id)


@router.put("/faculty/{faculty_id}")
def edit_faculty(faculty_id: str, faculty: Faculty, current_user=Depends(require_roles(["super_admin", "admin"]))):
    return update_faculty(faculty_id, faculty)


@router.delete("/faculty/{faculty_id}")
def remove_faculty(faculty_id: str, current_user=Depends(require_roles(["super_admin", "admin"]))):
    return delete_faculty(faculty_id)


@router.get("/faculty/students")
def faculty_students(current_user=Depends(require_roles(["super_admin", "admin"]))):
    from controllers.student_controller import get_students

    return get_students()


@router.get("/faculty/attendance")
def faculty_attendance(current_user=Depends(require_roles(["faculty", "super_admin", "admin"]))):
    return {"message": "Faculty attendance workspace ready", "items": []}


@router.get("/faculty/results")
def faculty_results(current_user=Depends(require_roles(["faculty", "super_admin", "admin"]))):
    return {"message": "Faculty results workspace ready", "items": []}
