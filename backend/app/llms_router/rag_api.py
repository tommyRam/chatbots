from fastapi import APIRouter, HTTPException, status
from .schemas import ChatResponse, UserRequest
from .services import simple_RAG

router = APIRouter()

@router.post("/api/simpleRAG", response_model=ChatResponse)
async def simple_rag(request: UserRequest):
    try:
        response = await simple_RAG(request.query)
        return response
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error from server"
        )