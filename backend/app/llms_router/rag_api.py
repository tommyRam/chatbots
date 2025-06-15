from fastapi import APIRouter
from .schemas import ChatResponse, UserRequest
from .services import simple_RAG

router = APIRouter()

@router.post("/api/simpleRAG", response_model=ChatResponse)
async def simple_rag(request: UserRequest):
    response = await simple_RAG(request.query)
    return response