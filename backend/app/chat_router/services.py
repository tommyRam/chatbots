import os
from typing import List
from googleapiclient.discovery import build
from google.oauth2 import service_account
from googleapiclient.http import MediaIoBaseUpload, MediaIoBaseDownload
from googleapiclient.errors import HttpError
import io
import sqlalchemy.orm as orm
from fastapi import UploadFile

from .crud import (
   get_chats_from_user_id,
   get_ai_messages_by_chat_id, 
   get_human_messages_by_chat_id,
   get_latest_human_messages_by_chat_id,
   add_ai_message,
   get_latest_ai_messages_by_chat_id,
   add_human_message,
   add_retrieved_document
)
from .schemas import ChatResponse, ChatAIMessageResponse, ChatHumanResponse
from config import settings
from models import (
   HumanMessagesModel,
   AIMessagesModel,
   RetrievedDocumentsModel
)
from llms_router.schemas import DocumentSchema

current_dir = os.path.dirname(os.path.abspath(__file__))
credential_path = os.path.join(current_dir, "..", "..", "credentials.json")
SCOPES = ['https://www.googleapis.com/auth/drive']

creds = service_account.Credentials.from_service_account_file(
    credential_path, scopes=SCOPES
)
drive_service = build('drive', 'v3', credentials=creds)
    
def get_drive_folder_id_by_name(folder_name):
    query = f"name = '{folder_name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    results = drive_service.files().list(q=query, fields="files(id, name)").execute()
    folders = results.get('files', [])
    
    if not folders:
        return None
    else:
        folder = folders[0]
        return folder['id']

async def upload_file_to_drive_folder(uploaded_file: UploadFile):
   try:
      
      folder_id = settings.PARENT_FOLDER_GOOGLE_DRIVE_ID
      file_content = await uploaded_file.read()
      file_stream = io.BytesIO(file_content)

      file_metadata = {
         'name': uploaded_file.filename,
         'parents': [folder_id]
      }
      media = MediaIoBaseUpload(
               file_stream,
               mimetype=uploaded_file.content_type or 'application/octet-stream',
               resumable=True
         )
      uploaded_file_drive = drive_service.files().create(
         body=file_metadata,
         media_body=media,
         fields='id, name'
      ).execute()
      return {"file_name": uploaded_file_drive['name'], "file_id": uploaded_file_drive['id']}
   except Exception as e:
      print(f"Error uploading file to Drive: {str(e)}")
      raise e
   finally:
      await uploaded_file.seek(0)

def download_drive_file(file_id: str):
  try:
    request = drive_service.files().get_media(fileId=file_id)
    file = io.BytesIO()
    downloader = MediaIoBaseDownload(file, request)
    done = False
    while done is False:
      status, done = downloader.next_chunk()
      print(f"Download {int(status.progress() * 100)}.")

    binary_file = file.getvalue()
    return binary_file
  except HttpError as error:
    print(f"An error occurred: {error}")
    file = None

def get_user_chats_by_user_id(user_id: str, db: orm.Session) -> List[ChatResponse]:
   chats = get_chats_from_user_id(user_id=user_id, db=db)
   chats_formatted_schemas = [
      ChatResponse(
         chat_id=chat.id,
         user_id=chat.user_id,
         document_id=chat.document_id,
         chat_name=chat.chat_name
      )
      for chat in chats
   ]
   return chats_formatted_schemas

def get_user_chat_ai_messages_by_chat_id(chat_id: str, db: orm.Session) -> List[ChatAIMessageResponse]:
   ai_messages = get_ai_messages_by_chat_id(chat_id=chat_id, db=db)
   ai_messages_formatted_schemas = [
      ChatAIMessageResponse(
         id=ai_message.id, 
         chat_id=ai_message.chat_id,
         content=ai_message.content,
         created_at=ai_message.created_at
      )
      for ai_message in ai_messages
   ]
   return ai_messages_formatted_schemas

def get_user_chat_human_messages_by_chat_id(chat_id: str, db: orm.Session) -> List[ChatHumanResponse]:
   human_messages = get_human_messages_by_chat_id(chat_id=chat_id, db=db)
   human_messages_formatted_schemas = [
      ChatHumanResponse(
         id=human_message.id,
         chat_id=human_message.chat_id,
         content=human_message.content,
         created_at=human_message.created_at
      )
      for human_message in human_messages
   ]
   return human_messages_formatted_schemas

def add_human_message_to_db(chat_id: str, content: str, db: orm.Session) -> HumanMessagesModel:
   try:
      human_message = HumanMessagesModel(
         chat_id=chat_id,
         content=content
      )
      add_human_message(human_message=human_message, db=db)
      latest_human_message = get_latest_human_messages_by_chat_id(chat_id=chat_id, db=db)
      return latest_human_message
   except Exception as e: 
      raise Exception(f"{e}\nCan't upload human message into database")

def add_ai_message_to_db(chat_id: str, content: str, db: orm.Session) -> AIMessagesModel:
   try: 
      ai_message = AIMessagesModel(
         chat_id=chat_id,
         content=content
      )
      add_ai_message(ai_message=ai_message, db=db)
      latest_ai_message = get_latest_ai_messages_by_chat_id(chat_id=chat_id, db=db)
      return latest_ai_message
   except Exception as e:
      raise Exception(f"{e}\nCan't upload ai message into database")
   
def add_retrieved_documents_to_db(
      documents_from_vectorestore: List[DocumentSchema], 
      human_message_id: str,
      db: orm.Session
) -> List[RetrievedDocumentsModel]:
   retrieved_documents: List[RetrievedDocumentsModel] = []
   try:
      for doc in documents_from_vectorestore:
         doc_model = RetrievedDocumentsModel(
            id_from_vectorestore = doc.id,
            human_message_id = human_message_id,
            content = doc.content,
            file_type = doc.file_type,
            page = doc.page,
            page_label = doc.page_label,
            title = doc.title,
            upload_time = doc.upload_time,
            score = doc.score
         )
         add_retrieved_document(retrieved_document=doc_model, db=db)
         retrieved_documents.append(doc_model)
      return retrieved_documents
   except Exception as e: 
      raise Exception(f"{e}\nCan't Upload retrieved documents to db")
