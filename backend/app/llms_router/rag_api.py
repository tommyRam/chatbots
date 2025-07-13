from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import StreamingResponse
import sqlalchemy.orm as orm
import json

from .schemas import ChatMessageResponse, UserRequest
from .services import (
    simple_RAG, 
    simple_RAG_stream_service,
    multi_query_RAG, 
    fusion_RAG, 
    decomposition_RAG,
    stepback_RAG,
    hyDe_RAG,
    corrective_RAG,
    get_relevant_documents_and_formatted_relevant_documents
)
from .utils.rag import add_human_ai_messages_and_documents_to_db
from router.schemas import LoginUserRequest
from router.services import current_user, get_db

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

@router.post("/simpleRAG/stream")
async def simple_rag_stream(
    request: UserRequest,
    user: LoginUserRequest = Depends(current_user),
    db: orm.Session = Depends(get_db)
):
    def generate():
        try:
            relevants_documents_formatted_schema, relevants_documents = get_relevant_documents_and_formatted_relevant_documents(query=request.query, chat_id=request.chat_id)
            documents_data = {
                "type": "documents",
                "data": [doc.dict() for doc in relevants_documents_formatted_schema],
                "done": False
            }
            yield f"data: {json.dumps(documents_data)}\n\n"

            full_response = ""
            for chunk in simple_RAG_stream_service(query=request.query, relevant_docs=relevants_documents):
                if chunk:
                    full_response += chunk
                    chunk_data = {
                        "type": "chunk",
                        "data": chunk,
                        "done": False
                    }
                    yield f"data: {json.dumps(chunk_data)}\n\n"
                
            completion_data = {
                "type": "complete",
                "data": "",
                "done": True
            }
            yield f"data: {json.dumps(completion_data)}\n\n"

            response = ChatMessageResponse(documents=relevants_documents, chat_response=full_response)
            add_human_ai_messages_and_documents_to_db(
                response=response,
                request=request,
                algorithm="Simple RAG",
                db=db
            )
        except Exception as e:
            error_data = {
                "type": "error",
                "data": f"An error from server",
                "done": True
            }
            yield f"data: {json.dumps(error_data)}\n\n"
    return StreamingResponse(
        generate(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
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