import sqlalchemy
import datetime
import sqlalchemy.orm as orm
import passlib.hash as hash
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from database import Base

class UserModel(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    firstname = Column(String, nullable=True)
    lastname = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.now())

    refresh_tokens = relationship("RefreshTokenModel", back_populates="user")

class RefreshTokenModel(Base):
    __tablename__ = "refresh_tokens"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    token = Column(String, unique=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    expires_at = Column(DateTime)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.now())

    user = relationship("UserModel", back_populates="refresh_tokens")


