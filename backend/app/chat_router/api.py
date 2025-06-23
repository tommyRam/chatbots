from fastapi import APIRouter, UploadFile, Depends, Form, File
import sqlalchemy.orm as orm
from typing import List

from .services import upload_file_to_drive_folder
from .schemas import (
    CreateChatUserRequest,
    CreateChatResponse
)
from .crud import (
    add_chat, 
    add_document,
    get_document_by_drive_id,
    get_chat_by_chat_name
)
from router.schemas import LoginUserRequest
from router.services import current_user, get_db
from models import DocumentModel, ChatModel
from llms_router.utils.rag import create_retriever

router = APIRouter(
    prefix="/api/chat"
)

@router.post("/create", response_model=CreateChatResponse)
async def create_chat(
    user_id: str = Form(...),
    chat_name: str = Form(...),
    uploaded_files: List[UploadFile] = File(...),
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
):
    try:
        # here we will consider only the first files because the frontend only send one file(for now)
        uploaded_drive_file_metadata = upload_file_to_drive_folder(uploaded_files[0].filename)
        if not upload_file_to_drive_folder:
            raise FileNotFoundError("Error when uploading file into drive!")
        
        new_document = DocumentModel(
            document_name = uploaded_drive_file_metadata["file_name"],
            document_drive_id = uploaded_drive_file_metadata["file_id"],
            document_size = uploaded_files[0].size
        )
        add_document(document=new_document, db=db)
        document_by_drive_id = get_document_by_drive_id(uploaded_drive_file_metadata["file_id"], db=db)
        new_chat = ChatModel(
            user_id = user_id,
            document_id = document_by_drive_id.id,
            chat_name = chat_name
        )
        add_chat(chat=new_chat, db=db)
        chat_by_name = get_chat_by_chat_name(chat_name=chat_name, db=db)

        # Add the documents to pinecone then add retriever for it
        create_retriever(uploaded_files=uploaded_files, namespace=chat_by_name.id)
        
        return CreateChatResponse(
            chat_id=chat_by_name.id,
            chat_name=chat_by_name.chat_name,
            document_drive_file_id=chat_by_name.document_id
        )
    except Exception as e:
        print(f"Error when creating chat: {str(e)}")
        raise(e)