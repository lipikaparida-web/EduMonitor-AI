from fastapi import APIRouter, Depends
from controllers.dashboard_controller import dashboard
from middleware.auth import require_roles

router = APIRouter(
    tags=["Dashboard"]
)

@router.get("/dashboard")
def dashboard_api(current_user=Depends(require_roles(["super_admin", "admin"]))):
    return dashboard()
