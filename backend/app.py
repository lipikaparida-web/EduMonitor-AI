from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.student import router as student_router
from routes.faculty import router as faculty_router
from routes.dashboard import router as dashboard_router
from routes.placement import router as placement_router
from routes.ai import router as ai_router
from routes.erp import router as erp_router
from controllers.auth_controller import login_user, register_user
from middleware.auth import get_optional_user
from schemas.login import LoginRequest
from schemas.register import RegisterRequest
from fastapi import Depends

app = FastAPI(
    title="EduMonitor AI Backend",
    version="1.0.0"
)

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------------------

app.include_router(auth_router)
app.include_router(student_router)
app.include_router(faculty_router)
app.include_router(dashboard_router)
app.include_router(placement_router)
app.include_router(ai_router)
app.include_router(erp_router)


@app.get("/")
def home():
    return {
        "status": "Running",
        "message": "EduMonitor AI Backend Started Successfully"
    }


@app.post("/login", tags=["Authentication"])
def legacy_login(payload: LoginRequest):
    return login_user(payload)


@app.post("/register", tags=["Authentication"])
def legacy_register(payload: RegisterRequest, current_user=Depends(get_optional_user)):
    return register_user(payload, current_user)
