from fastapi import APIRouter, HTTPException, status, Depends
import sqlalchemy.orm as orm
from .schemas import ChatMessageResponse, UserRequest
from .services import (
    simple_RAG, 
    multi_query_RAG, 
    fusion_RAG, 
    decomposition_RAG
)
from router.schemas import LoginUserRequest
from router.services import current_user, get_db
from chat_router.services import (
    add_ai_message_to_db, 
    add_human_message_to_db,
    add_retrieved_documents_to_db
)

router = APIRouter(
    prefix="/api/RAG"
)

@router.post("/simpleRAG", response_model=ChatMessageResponse)
async def simple_rag(
    request: UserRequest,
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
    ):
    try:
        response = await simple_RAG(request.query, request.chat_id)
        human_message_response = add_human_message_to_db(chat_id=request.chat_id, content=request.query,db=db)
        add_ai_message_to_db(chat_id=request.chat_id, content=response.chat_response, db=db)
        add_retrieved_documents_to_db(documents_from_vectorestore=response.documents, human_message_id=human_message_response.id, algorithm="Simple RAG", db=db)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail= f"An error from server: {e}"
        )
    
@router.post("/multiQueryRAG", response_model=ChatMessageResponse)
async def multi_query_rag(
    request: UserRequest,
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
    ):
    try: 
        response = await multi_query_RAG(request.query, request.chat_id)
        human_message_response = add_human_message_to_db(chat_id=request.chat_id, content=request.query,db=db)
        add_ai_message_to_db(chat_id=request.chat_id, content=response.chat_response, db=db)
        add_retrieved_documents_to_db(documents_from_vectorestore=response.documents, human_message_id=human_message_response.id, algorithm="Multi Query RAG", db=db)        
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail= f"An error from server: {e}"
        )

@router.post("/fusionRAG", response_model=ChatMessageResponse)
async def fusion_rag(
    request: UserRequest,
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
    ):
    try: 
        response = await fusion_RAG(request.query, request.chat_id)
        human_message_response = add_human_message_to_db(chat_id=request.chat_id, content=request.query,db=db)
        add_ai_message_to_db(chat_id=request.chat_id, content=response.chat_response, db=db)
        add_retrieved_documents_to_db(documents_from_vectorestore=response.documents, human_message_id=human_message_response.id, algorithm="Fusion RAG", db=db)        
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail= f"An error from server: {e}"
        )

@router.post("/decompositionRAG", response_model=ChatMessageResponse)
async def decomposition_rag(
    request: UserRequest,
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
    ):
    try:
        response = await decomposition_RAG(request.query, request.chat_id)
        human_message_response = add_human_message_to_db(chat_id=request.chat_id, content=request.query,db=db)
        add_ai_message_to_db(chat_id=request.chat_id, content=response.chat_response, db=db)
        add_retrieved_documents_to_db(documents_from_vectorestore=response.documents, human_message_id=human_message_response.id, algorithm="Decomposition RAG", db=db)
        return response
    except Exception as e:
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail= f"An error from server: {e}"
        )