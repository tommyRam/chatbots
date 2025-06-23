import sqlalchemy.orm as orm
from datetime import datetime

from models import ChatModel, DocumentModel

def add_chat(chat: ChatModel, db: orm.Session):
    db.add(chat)
    db.commit()
    db.refresh(chat)

def get_chats_from_user_id(user_id: str, db: orm.Session):
    return db.query(ChatModel).filter(ChatModel.user_id == user_id).all()

def get_chat_by_id(chat_id: str, db: orm.Session):
    return db.query(ChatModel).filter(ChatModel.id == chat_id).first()

def get_chat_by_chat_name(chat_name: str, db: orm.Session):
    return db.query(ChatModel).filter(ChatModel.chat_name == chat_name).first()

def add_document(document: DocumentModel, db: orm.Session):
    db.add(document)
    db.commit()
    db.refresh(document)

def get_document_by_id(document_id: str, db: orm.Session):
    return db.query(DocumentModel).filter(DocumentModel.id == document_id).first()

def get_document_by_drive_id(document_drive_id: str, db: orm.Session):
    return db.query(DocumentModel).filter(DocumentModel.document_drive_id == document_drive_id).first()


