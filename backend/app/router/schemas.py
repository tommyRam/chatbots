from pydantic import BaseModel, field_validator
from datetime import datetime
import re
from typing import Optional

class UserBase(BaseModel):
    email: str
    username: str

    @field_validator("email")
    def check_email(cls, value):
        email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(email_regex, value):
            raise ValueError("Invalid email address")
        return value

    @field_validator("username")
    def check_username(cls, value):
        username_regex = r"^[a-zA-Z0-9_]+$"
        if not re.match(username_regex, value):
            raise ValueError("Username must contains only character or _")
        if value[0] == '_':
            raise ValueError("Username must begin with character")
        return value
    
class UserSchema(UserBase):
    id: str
    hashed_password: str
    firstname: Optional[str] = None 
    lastname: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime

    class Config: 
        from_attributes = True

class RegisterUserRequest(UserBase):
    password: str
    firstname: Optional[str] = None 
    lastname: Optional[str] = None
    phone: Optional[str] = None

    @field_validator("password")
    def check_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password size must be 8 characters at least")
        return value
    
    class Config: 
        from_attributes = True

class LoginUserRequest(BaseModel):
    unique_user_id: str
    password: str

    class Config:
        from_attributes = True
    
class UserResponse(UserBase):
    id: str
    firstname: Optional[str] = None 
    lastname: Optional[str] = None
    phone: Optional[str] = None

    class Config: 
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class RefreshTokenRequest(BaseModel):
    refresh_token: str