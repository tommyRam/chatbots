import sqlalchemy.orm as orm
import jwt
from passlib.context import CryptContext
from typing import Optional
from datetime import datetime, timedelta
import secrets
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status

from database import SessionLocal, Base, engine
from .schemas import RegisterUserRequest, UserResponse, TokenResponse
from .models import UserModel, RefreshTokenModel
from .crud import add_user, add_refresh_token, get_refresh_token_by_token, get_user_by_id, get_user_by_email, get_user_by_username, get_active_refresh_token_from_user_id
from config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2schema = OAuth2PasswordBearer("api/app/auth/login")

def create_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally:
        db.close()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

async def create_user(user: RegisterUserRequest, db: orm.Session) -> UserModel:
    hashed_password = hash_password(user.password)

    user_model = UserModel(
        email = user.email,
        username = user.username,
        firstname = user.firstname,
        lastname = user.lastname, 
        hashed_password = hashed_password,
        phone = user.phone
    )
    add_user(user_model, db)
    user_model_with_id = await get_user_by_email(user.email, db)

    return user_model_with_id

async def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta: 
        expire = datetime.now() + expires_delta
    else: 
        expire = datetime.now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.ALGORITHM)

    return encoded_jwt

async def create_refresh_token(user_id: str, db: orm.Session) -> str:
    old_token = await get_active_refresh_token_from_user_id(user_id=user_id, db=db)

    if old_token:
        await revoke_refresh_token(old_token.token, db)

    token = secrets.token_urlsafe(32)
    expires_at = datetime.now() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    db_refresh_token = RefreshTokenModel(
        token=token,
        user_id=user_id,
        expires_at=expires_at
    )
    
    await add_refresh_token(db_refresh_token, db)
    return token

async def verify_refresh_token(refresh_token: str, db: orm.Session) -> Optional[UserModel]:
    db_token = get_refresh_token_by_token(refresh_token=refresh_token, db=db)

    if db_token:
        user_model = await get_user_by_id(db_token.user_id, db)
        return user_model
    return None

async def revoke_refresh_token(refresh_token: str, db: orm.Session):
    db_token = await get_refresh_token_by_token(refresh_token, db)

    if db_token:
        db_token.is_revoked = True
        db.commit()

async def verify_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "access":
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.PyJWTError:
        return None
    
async def is_user_exist(unique_user_id: str, db: orm.Session) -> bool:
    user_from_email = await get_user_by_email(unique_user_id, db)
    if user_from_email:
        return True
    
    user_from_username = await get_user_by_username(unique_user_id, db)
    if user_from_username:
        return True
    
    return False

async def current_user(token: str = Depends(oauth2schema), db: orm.Session = Depends(get_db)):
    try:
        payload = await verify_access_token(token)
        user = await get_user_by_email(payload['email'], db)

        if not user: 
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong credentials!"
        )
    except Exception as e:
        raise
    
    return UserResponse.model_validate(user)




    