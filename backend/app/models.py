import datetime
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Float
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
    chat = relationship("ChatModel", back_populates="user")

class RefreshTokenModel(Base):
    __tablename__ = "refresh_tokens"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    token = Column(String, unique=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    expires_at = Column(DateTime)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.now())

    user = relationship("UserModel", back_populates="refresh_tokens")

class ChatModel(Base):
    __tablename__ = "chats"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id"))
    document_id = Column(String, ForeignKey("documents.id"))
    created_at = Column(DateTime, default=datetime.datetime.now())
    chat_name = Column(String, unique=True)

    user = relationship("UserModel", back_populates="chat")
    document = relationship("DocumentModel", back_populates="chat")

class DocumentModel(Base):
    __tablename__ = "documents"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    document_name = Column(String)
    document_drive_id=Column(String, unique=True)
    document_size = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now())

    chat = relationship("ChatModel", back_populates="document")