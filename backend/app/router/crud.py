import sqlalchemy.orm as orm
from datetime import datetime

from .models import UserModel, RefreshTokenModel

def get_user_by_email(email: str, db: orm.Session):
    return db.query(UserModel).filter(UserModel.email == email).first()

def get_user_by_id(id: str, db: orm.Session):
    return db.query(UserModel).filter(UserModel.id == id).first()

def get_user_by_username(username: str, db: orm.Session):
    return db.query(UserModel).filter(UserModel.username == username).first()

def add_user(user: UserModel, db: orm.Session):
    db.add(user)
    db.commit()
    db.refresh(user)

def add_refresh_token(refresh_token: RefreshTokenModel, db: orm.Session):
    db.add(refresh_token)
    db.commit()

def get_refresh_token_by_token(refresh_token: str, db: orm.Session):
    return db.query(RefreshTokenModel).filter(
        RefreshTokenModel.token == refresh_token,
        RefreshTokenModel.is_revoked == False,
        RefreshTokenModel.expires_at > datetime.now()
    ).first()

def get_active_refresh_token_from_user_id(user_id: str, db: orm.Session):
    return db.query(RefreshTokenModel).filter(
        RefreshTokenModel.user_id == user_id,
        RefreshTokenModel.is_revoked == False
    ).first()
