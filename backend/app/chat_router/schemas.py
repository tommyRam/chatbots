from pydantic import BaseModel
from fastapi import UploadFile, File
from typing import List
from datetime import datetime

class ChatResponse(BaseModel):
    chat_id: str
    user_id: str
    chat_name: str
    document_id: str

class GetChatListRequest(BaseModel):
    user_id: str

class ChatAIMessageResponse(BaseModel):
    id: str
    chat_id: str
    content: str
    created_at: datetime

class ChatHumanResponse(BaseModel):
    id: str
    chat_id: str
    content: str
    created_at: datetime   