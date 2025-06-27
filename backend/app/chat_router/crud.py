import sqlalchemy.orm as orm
from datetime import datetime

from models import (
    ChatModel, 
    DocumentModel, 
    HumanMessagesModel, 
    AIMessagesModel, 
    RetrievedDocumentsModel
)

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

def add_human_message(human_message: HumanMessagesModel, db: orm.Session):
    db.add(human_message)
    db.commit()
    db.refresh(human_message)

def get_latest_human_messages_by_chat_id(chat_id: str, db: orm.Session):
    return db.query(HumanMessagesModel).filter(HumanMessagesModel.chat_id == chat_id).order_by(HumanMessagesModel.created_at.desc()).first()

def get_human_messages_by_chat_id(chat_id: str, db: orm.Session):
    return db.query(HumanMessagesModel).filter(HumanMessagesModel.chat_id == chat_id).order_by(HumanMessagesModel.created_at.desc()).all()

def add_ai_message(ai_message: AIMessagesModel, db: orm.Session):
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)

def get_latest_ai_messages_by_chat_id(chat_id: str, db: orm.Session):
    return db.query(AIMessagesModel).filter(AIMessagesModel.chat_id == chat_id).order_by(AIMessagesModel.created_at.desc()).first()

def get_ai_messages_by_chat_id(chat_id: str, db: orm.Session):
    return db.query(AIMessagesModel).filter(AIMessagesModel.chat_id == chat_id).order_by(AIMessagesModel.created_at.desc()).all()

def add_retrieved_document(retrieved_document: RetrievedDocumentsModel, db: orm.Session):
    db.add(retrieved_document)
    db.commit()
    db.refresh(retrieved_document)

def get_retrieved_documents_by_human_message_id(human_message_id: str, db: orm.Session):
    return db.query(RetrievedDocumentsModel).filter(RetrievedDocumentsModel.human_message_id == human_message_id).all()


