from fastapi import APIRouter, Depends, HTTPException, status
import sqlalchemy.orm as orm

from .schemas import TokenResponse, RegisterUserRequest
from .services import get_db, create_user, create_access_token, create_refresh_token
from .crud import get_user_by_email, get_user_by_username
from .models import UserModel
from config import settings

router = APIRouter(
    prefix="/api/app", 
)

@router.post("/register/user", response_model=TokenResponse)
async def register_user(
    payload: RegisterUserRequest,
    db: orm.Session = Depends(get_db)
):
    user_by_username = get_user_by_username(payload.username, db)
    if user_by_username: 
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exist. Please try another one."
        )

    user_by_email = get_user_by_email(payload.email, db)
    if user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The email already used. Please try another one."
        )
    
    user_model = create_user(payload, db)
    access_token = create_access_token(dict(user_model))
    refresh_token = create_refresh_token(user_model.id, db)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )