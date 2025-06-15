from pydantic import BaseModel
from typing import List

class ChatResponse(BaseModel):
    documents: List[str]
    chat_response: str

class UserRequest(BaseModel):
    query: str