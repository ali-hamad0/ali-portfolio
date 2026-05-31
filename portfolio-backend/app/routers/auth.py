from fastapi import APIRouter, HTTPException, status
from app.schemas.schemas import LoginRequest, TokenResponse
from app.auth import create_token
from app.config import settings

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    if body.password != settings.ADMIN_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
    return {"access_token": create_token()}
