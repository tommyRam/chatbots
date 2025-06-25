from pydantic import BaseModel
from typing import List, Optional

class DocumentSchema(BaseModel):
    id: str
    content: str
    file_type: Optional[str]
    page: Optional[int]
    page_label: Optional[str]
    title: Optional[str]
    upload_time: Optional[str]
    score: Optional[str] = ""

class ChatResponse(BaseModel):
    documents: List[DocumentSchema]
    chat_response: str

class UserRequest(BaseModel):
    query: str
    chat_id: str