from fastapi import APIRouter, Depends, HTTPException, status
import sqlalchemy.orm as orm

from .schemas import TokenResponse, RegisterUserRequest, LoginUserRequest, UserResponse, UserSchema
from .crud import get_user_by_email, get_user_by_username
from .models import UserModel
from config import settings
from .services import get_db, create_user, create_access_token, create_refresh_token, is_user_exist, verify_password, current_user

router = APIRouter(
    prefix="/api/app", 
)

@router.post("/register/user", response_model=TokenResponse)
async def register_user(
    payload: RegisterUserRequest,
    db: orm.Session = Depends(get_db)
):
    user_by_username = await get_user_by_username(payload.username, db)
    if user_by_username: 
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exist. Please try another one."
        )

    user_by_email = await get_user_by_email(payload.email, db)
    if user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The email already used. Please try another one."
        )
    
    user_model = await create_user(payload, db)
    access_token = await create_access_token(dict(user_model))
    refresh_token = await create_refresh_token(user_model.id, db)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm

@router.post("/auth/login", response_model=TokenResponse)
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: orm.Session = Depends(get_db)
):
    user_identifier = form_data.username
    password = form_data.password

    is_user = await is_user_exist(user_identifier, db)

    if not is_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The username or email doesn't exist. Please try again"
        )

    user_by_email = await get_user_by_email(user_identifier, db)
    user_by_username = await get_user_by_username(user_identifier, db)
    user = user_by_email if user_by_email else user_by_username

    password_is_ok = verify_password(password, user.hashed_password)
    if not password_is_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The password you add is not correct"
        )

    user_schema = UserSchema.model_validate(user)
    user_data = user_schema.model_dump(mode="json")
    access_token = await create_access_token(user_data)
    refresh_token = await create_refresh_token(user.id, db)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

@router.get("/auth/current-user", response_model=UserResponse)
async def get_current_user(user: UserResponse = Depends(current_user)):
    return user
