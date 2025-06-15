import os
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma

current_dir = os.path.dirname(os.path.abspath(__file__))
doc_path = os.path.join(current_dir,"..", "dev_data_api", "Be_Good.pdf")

# For the moment just use local data but after the data is loaded by the users
def load_data(doc_path):
    try: 
        loader = PyPDFLoader(doc_path)
        docs= loader.load()
        return docs
    except FileNotFoundError as e: 
        raise FileNotFoundError(f"File not found for docpath: {doc_path} - error: {e}")
    except: 
        print("Error from loading data")
        raise

def make_splitter(chunk_size, chunk_overlap):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    return text_splitter

# For now we use Chroma but after we will use more powerful vectorestore
def create_retriever(embedding, doc_path = doc_path, k = 1):
    """
        Create a retriever for the giving doc_path and store in Chroma db
    """
    try:
        docs = load_data(doc_path=doc_path)
        splitter = make_splitter(chunk_size=1000, chunk_overlap=200)
        docs_splits = splitter.split_documents(docs)
        vectorestore = Chroma.from_documents(
            documents=docs_splits, 
            embedding=embedding
        )
        retriever = vectorestore.as_retriever(search_kwargs={"k": k})
        return retriever
    except FileNotFoundError as file_not_found_error:
        raise FileNotFoundError(file_not_found_error)
    except:
        print("Error from creating retriever")
        raise