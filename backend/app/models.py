import datetime
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Float, Integer
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
    created_at = Column(DateTime)

    refresh_tokens = relationship("RefreshTokenModel", back_populates="user")
    chat = relationship("ChatModel", back_populates="user")

class RefreshTokenModel(Base):
    __tablename__ = "refresh_tokens"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    token = Column(String, unique=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    expires_at = Column(DateTime)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime)

    user = relationship("UserModel", back_populates="refresh_tokens")

class ChatModel(Base):
    __tablename__ = "chats"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id"))
    document_id = Column(String, ForeignKey("documents.id"))
    created_at = Column(DateTime)
    chat_name = Column(String, unique=True)

    user = relationship("UserModel", back_populates="chat")
    document = relationship("DocumentModel", back_populates="chat")
    human_message = relationship("HumanMessagesModel", back_populates="chat")
    ai_message = relationship("AIMessagesModel", back_populates="chat")

class DocumentModel(Base):
    __tablename__ = "documents"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    document_name = Column(String)
    document_drive_id=Column(String, unique=True)
    document_size = Column(Float, nullable=True)
    created_at = Column(DateTime)

    chat = relationship("ChatModel", back_populates="document")

class HumanMessagesModel(Base):
    __tablename__ = "human_messages"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    chat_id = Column(String, ForeignKey("chats.id"))
    content = Column(String)
    created_at = Column(DateTime)

    chat = relationship("ChatModel", back_populates="human_message")
    retrieved_document = relationship("RetrievedDocumentsModel", back_populates="human_message")

class AIMessagesModel(Base):
    __tablename__ = "ai_messages"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    chat_id = Column(String, ForeignKey("chats.id"))
    content = Column(String)
    created_at = Column(DateTime)

    chat = relationship("ChatModel", back_populates="ai_message")

class RetrievedDocumentsModel(Base):
    __tablename__ = "retrieved_documents"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    id_from_vectorestore = Column(String)
    human_message_id = Column(String, ForeignKey("human_messages.id"))
    content = Column(String)
    file_type = Column(String, nullable=True)
    page = Column(Integer, nullable=True)
    page_label = Column(String, nullable=True)
    title = Column(String, nullable=True)
    upload_time = Column(String, nullable=True)
    score = Column(String, nullable=True)
    created_at = Column(DateTime)

    human_message = relationship("HumanMessagesModel", back_populates="retrieved_document")
