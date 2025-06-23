from pydantic import BaseModel
from fastapi import UploadFile, File
from typing import List

class CreateChatUserRequest(BaseModel):
    user_id: str
    uploaded_files: List[UploadFile]
    chat_name: str

class CreateChatResponse(BaseModel):
    chat_id: str
    chat_name: str
    document_drive_file_id: str