from fastapi import APIRouter, HTTPException, status, Depends
import sqlalchemy.orm as orm
from .schemas import ChatMessageResponse, UserRequest
from .services import (
    simple_RAG, 
    multi_query_RAG, 
    fusion_RAG, 
    decomposition_RAG,
    stepback_RAG,
    hyDe_RAG,
    corrective_RAG
)
from .utils.rag import add_human_ai_messages_and_documents_to_db
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
        add_human_ai_messages_and_documents_to_db(response=response, request=request, algorithm="Simple RAG", db=db)
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
        add_human_ai_messages_and_documents_to_db(response=response, request=request, algorithm="Multi query RAG", db=db)       
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
        add_human_ai_messages_and_documents_to_db(response=response, request=request, algorithm="Fusion RAG", db=db)      
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
        add_human_ai_messages_and_documents_to_db(response=response, request=request, algorithm="Decomposition RAG", db=db)
        return response
    except Exception as e:
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail= f"An error from server: {e}"
        )

@router.post("/stepbackRAG", response_model=ChatMessageResponse)
async def stepback_RAG_api(
    request: UserRequest,
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
): 
    try:
        response = await stepback_RAG(question=request.query, chat_id=request.chat_id)
        add_human_ai_messages_and_documents_to_db(response=response, request=request, algorithm="Stepback RAG", db=db)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail= f"An error from server: {e}"
        ) 
    
@router.post("/hyDeRAG", response_model=ChatMessageResponse)
async def hyde_RAG_api(
    request: UserRequest,
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
):
    try:
        response = await hyDe_RAG(question=request.query, chat_id=request.chat_id)
        add_human_ai_messages_and_documents_to_db(response=response, request=request, algorithm="HyDe RAG", db=db)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail= f"An error from server: {e}"
        ) 
    
@router.post("/CRAG", response_model=ChatMessageResponse)
async def corrective_RAG_api(
    request: UserRequest,
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
):
    try:
        response = await corrective_RAG(question=request.query, chat_id=request.chat_id)
        add_human_ai_messages_and_documents_to_db(response=response, request=request, algorithm="Corrective RAG", db=db)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail= f"An error from server: {e}"
        ) 