import os

os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader
)
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from fastapi import UploadFile
from typing import List
import tempfile
from datetime import datetime, time
from dotenv import load_dotenv, find_dotenv
import sqlalchemy.orm as orm
from more_itertools import chunked

from config import settings
from models import AIMessagesModel
from ..schemas import ChatMessageResponse, UserRequest
from chat_router.services import add_ai_message_to_db, add_human_message_to_db, add_retrieved_documents_to_db

MAX_BATCH_SIZE = 50

_ = load_dotenv(find_dotenv())
current_dir = os.path.dirname(os.path.abspath(__file__))
doc_path = os.path.join(current_dir,"..", "dev_data_api", "Be_Good.pdf")
embedding = GoogleGenerativeAIEmbeddings(model=settings.google_embedding_model)

def load_data_from_uploads(uploaded_file: UploadFile):
    docs = []

    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{uploaded_file.filename}") as tmp_file:
            content = uploaded_file.file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        # Reset file pointer for potential reuse
        uploaded_file.file.seek(0)

        file_extension = os.path.splitext(uploaded_file.filename)[1].lower()

        if file_extension == ".pdf":
            loader = PyPDFLoader(tmp_file_path)
        elif file_extension == ".txt":
            loader = TextLoader(tmp_file_path, encoding="utf-8")
        elif file_extension in [".docx", ".doc"]:
            loader = Docx2txtLoader(tmp_file_path)
        else:
            loader = TextLoader(tmp_file_path, encoding="utf-8")

        file_docs = loader.load()

        for doc in file_docs:
            doc.metadata["source_file"] = uploaded_file.filename
            doc.metadata["file_type"] = file_extension
            doc.metadata["upload_time"] = datetime.now().isoformat()
        
        docs.extend(file_docs)
    except Exception as e:
        print(f"Error loading file {uploaded_file.filename}: {str(e)}")
        raise e
    finally:
        if "tmp_file_pat" in locals() and os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)
    
    if not docs:
        raise ValueError("No Documents could be loaded from uploaded files")
            
    return docs


def make_splitter(chunk_size: int = 500, chunk_overlap: int = 100):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    return text_splitter

def upload_data_to_vectorestore( 
        uploaded_files: List[UploadFile], 
        namespace: str,  
        embedding = embedding,
        search_type: str = "similarity_score_threshold",
        score_threshold: int = 0.4,
        k: int = 3
    ):
    print("====================Uploading to pinecone==========================")
    try:
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        index = pc.Index(settings.PINECONE_INDEX_NAME)
        vectorestore = PineconeVectorStore(index=index, embedding=embedding, namespace=namespace)

        docs = load_data_from_uploads(uploaded_file=uploaded_files)
        splitter = make_splitter(chunk_size=1000, chunk_overlap=200)
        docs_splits = splitter.split_documents(docs)

        for batch in chunked(docs_splits, MAX_BATCH_SIZE):
            vectorestore.add_documents(documents=batch)
    except Exception as e:
        print(f"Error creating retriever: {str(e)}")
        raise e


def get_vectorestore_from_namespace(
        embedding, 
        namespace: str,
        search_type: str = "similarity_score_threshold",
        score_threshold: int = 0.4,
        k: int = 3
    ):
    pc = Pinecone(api_key=settings.PINECONE_API_KEY)
    index = pc.Index(settings.PINECONE_INDEX_NAME)
    vectorestore = PineconeVectorStore(index=index, embedding=embedding, namespace=namespace)
    return vectorestore

# Return the last message from the backend
def add_human_ai_messages_and_documents_to_db(response: ChatMessageResponse, request: UserRequest, algorithm: str, db: orm.Session) -> AIMessagesModel:
    human_message_response = add_human_message_to_db(chat_id=request.chat_id, content=request.query, db=db)
    latest_ai_message = add_ai_message_to_db(chat_id=request.chat_id, content=response.chat_response, db=db)
    add_retrieved_documents_to_db(documents_from_vectorestore=response.documents, human_message_id=human_message_response.id, algorithm=algorithm, db=db)
    return latest_ai_message