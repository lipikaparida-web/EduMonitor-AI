from fastapi import APIRouter, Depends
from models.placement import Placement
from controllers.placement_controller import predict_placement
from middleware.auth import require_roles
from controllers.placement_controller import (
    add_placement,
    read_placements,
    read_placement,
    edit_placement,
    remove_placement
)

router = APIRouter(
    tags=["Placement"]
)

@router.post("/placements")
def create(data: Placement, current_user=Depends(require_roles(["super_admin", "admin", "placement_officer"]))):
    return add_placement(data)

@router.get("/placements")
def get_all(current_user=Depends(require_roles(["super_admin", "admin", "placement_officer"]))):
    return read_placements()

@router.get("/placements/{id}")
def get_one(id: str, current_user=Depends(require_roles(["super_admin", "admin", "placement_officer"]))):
    return read_placement(id)

@router.put("/placements/{id}")
def update(id: str, data: Placement, current_user=Depends(require_roles(["super_admin", "admin", "placement_officer"]))):
    return edit_placement(id, data)

@router.delete("/placements/{id}")
def delete(id: str, current_user=Depends(require_roles(["super_admin", "admin", "placement_officer"]))):
    return remove_placement(id)

@router.post("/placement/predict")
def predict(student_id: str, current_user=Depends(require_roles(["super_admin", "admin", "placement_officer"]))):
    from controllers.placement_controller import predict_placement
    return predict_placement(student_id)

@router.post("/placement/predict/{student_id}")
def predict(student_id: str, current_user=Depends(require_roles(["super_admin", "admin", "placement_officer"]))):
    return predict_placement(student_id)
