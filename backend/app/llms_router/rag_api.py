from fastapi import APIRouter, HTTPException, status
from .schemas import ChatResponse, UserRequest
from .services import simple_RAG, multi_query_RAG

router = APIRouter()

@router.post("/api/RAG/simpleRAG", response_model=ChatResponse)
async def simple_rag(request: UserRequest):
    try:
        response = await simple_RAG(request.query)
        return response
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error from server"
        )
    
@router.post("/api/RAG/multiQueryRAG", response_model=ChatResponse)
async def multi_query_rag(request: UserRequest):
    try: 
        response = await multi_query_RAG(request.query)
        return response
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error from server"
        )