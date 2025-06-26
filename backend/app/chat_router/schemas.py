from pydantic import BaseModel
from fastapi import UploadFile, File
from typing import List

class ChatResponse(BaseModel):
    chat_id: str
    user_id: str
    chat_name: str
    document_id: str

class GetChatListRequest(BaseModel):
    user_id: str