from fastapi import APIRouter, UploadFile, Depends, Form, File, HTTPException, status
import sqlalchemy.orm as orm
from typing import List
from datetime import datetime

from .services import (
    # upload_file_to_drive_folder, 
    get_user_chats_by_user_id,
    get_user_chat_ai_messages_by_chat_id,
    get_user_chat_human_messages_by_chat_id,
    get_retrieved_documents_by_human_message_id_from_db,
    get_user_chat_latest_human_message_by_chat_id_from_db,
    get_user_chat_latest_ai_message_by_chat_id_from_db
)
from .schemas import (
    ChatResponse,
    GetChatListRequest,
    ChatAIMessageResponse,
    ChatHumanResponse,
    RetrievedDocumentsResponse
)
from .crud import (
    add_chat, 
    # add_document,
    # get_document_by_drive_id,
    get_chat_by_chat_name
)
from router.schemas import LoginUserRequest
from router.services import current_user, get_db
from models import ChatModel
from llms_router.utils.rag import upload_data_to_vectorestore

router = APIRouter(
    prefix="/api/chat"
)

# This code take more time to execute due to the all process needed for it
# TODO: if there is a better way to low the latency then do it (search for it)
@router.post("/create", response_model=ChatResponse)
async def create_chat(
    user_id: str = Form(...),
    chat_name: str = Form(...),
    uploaded_files: UploadFile = File(...),
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
):
    try:
        # uploaded_drive_file_metadata = await upload_file_to_drive_folder(uploaded_files)
        # if not upload_file_to_drive_folder:
        #     raise FileNotFoundError("Error when uploading file into drive!")
        
        # new_document = DocumentModel(
        #     document_name=uploaded_drive_file_metadata["file_name"],
        #     document_drive_id=uploaded_drive_file_metadata["file_id"],
        #     document_size=uploaded_files.size,
        #     created_at=datetime.now()
        # )
        # add_document(document=new_document, db=db)
        # document_by_drive_id = get_document_by_drive_id(uploaded_drive_file_metadata["file_id"], db=db)
        new_chat = ChatModel(
            user_id=user_id,
            # document_id=document_by_drive_id.id,
            chat_name=chat_name,
            created_at=datetime.now()
        )
        add_chat(chat=new_chat, db=db)
        chat_by_name = get_chat_by_chat_name(chat_name=chat_name, db=db)

        # Add the documents to pinecone then add retriever for it
        upload_data_to_vectorestore(uploaded_files=uploaded_files, namespace=chat_by_name.id)
        
        return ChatResponse(
            chat_id=chat_by_name.id,
            user_id=user_id,
            chat_name=chat_by_name.chat_name,
            # document_id=chat_by_name.document_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cannot create the new chat"
        )
    
@router.get("/list/{user_id}", response_model=List[ChatResponse])
async def get_user_chat_lists(
    user_id: str,
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
):
    try:
        chats = get_user_chats_by_user_id(user_id=user_id, db=db)
        return chats
    except Exception as e:
        print(f"Error when retrieving chats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cannot retrieve your chat lists: {str(e)}"
        )
    
@router.get("/list/ai-message/{chat_id}", response_model=List[ChatAIMessageResponse])
def get_chat_ai_messages(
    chat_id: str,
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
):
    try: 
        ai_messages = get_user_chat_ai_messages_by_chat_id(chat_id=chat_id, db=db)
        return ai_messages
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cannot retrieve AI responses: {str(e)}"
        )

@router.get("/latest/ai-message/{chat_id}", response_model=ChatAIMessageResponse)
def get_latest_ai_message(
    chat_id: str, 
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
):
    try:
        latest_ai_message = get_user_chat_latest_ai_message_by_chat_id_from_db(chat_id=chat_id, db=db)
        return latest_ai_message
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cannot retrieve latest AI response: {str(e)}"
        )

@router.get("/list/human-message/{chat_id}", response_model=List[ChatHumanResponse])
def get_chat_human_messages(
    chat_id: str, 
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
):
    try: 
        human_messages = get_user_chat_human_messages_by_chat_id(chat_id=chat_id, db=db)
        return human_messages
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cannot retrieve human messages: {str(e)}"
        )
    
@router.get("/latest/human-message/{chat_id}", response_model=ChatHumanResponse)
def get_latest_human_message(
    chat_id: str, 
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
):
    try:
        human_message = get_user_chat_latest_human_message_by_chat_id_from_db(chat_id=chat_id, db=db)
        return human_message
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cannot retrieve latest human message: {str(e)}"
        )     

@router.get("/list/retrieved-documents/{human_message_id}", response_model=List[RetrievedDocumentsResponse])
def get_retrieved_documents(
    human_message_id: str, 
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
):
    try:
        retrieved_documents = get_retrieved_documents_by_human_message_id_from_db(
            human_message_id=human_message_id, 
            db=db
        )
        return retrieved_documents
    except Exception as e:
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cannot retrieve documents: {str(e)}"
        )