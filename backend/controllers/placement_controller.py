from fastapi import HTTPException
from services.placement_service import placement_prediction
from services.placement_service import (
    create_placement,
    get_all_placements,
    get_placement_by_id,
    update_placement,
    delete_placement,
    placement_prediction
)


def add_placement(placement):
    return create_placement(placement)


def read_placements():
    return get_all_placements()


def read_placement(id):

    placement = get_placement_by_id(id)

    if not placement:
        raise HTTPException(
            status_code=404,
            detail="Placement Not Found"
        )

    return placement


def edit_placement(id, placement):
    return update_placement(id, placement)


def remove_placement(id):
    return delete_placement(id)


# -------------------------------
# AI Placement Prediction
# -------------------------------

def predict_placement(student_id: str):
    return placement_prediction(student_id)