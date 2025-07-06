# RAG Testing Platform

A comprehensive platform for testing and comparing different Retrieval-Augmented Generation (RAG) algorithms. This application allows users to upload documents, test various RAG implementations, and generate corresponding code notebooks for their preferred algorithms.

## Features

- **7 RAG Algorithms**: Test and compare different RAG implementations

  - Simple RAG
  - MultiQuery RAG
  - Fusion RAG
  - Decomposition RAG
  - StepBack RAG
  - HyDE RAG
  - Corrective RAG

- **Document Upload & Chat**: Create chats with document context for testing
- **Real-time Testing**: Ask questions and get responses with retrieved documents and the corresponding code
- **User Authentication**: Secure login system with JWT tokens

## Tech Stack

### Frontend

- **Next.js** - React framework for the user interface
- **JWT** - Authentication tokens

### Backend

- **FastAPI** - Python web framework
- **SQLite** - Database for user data and chat history
- **LangChain** - Framework for LLM applications
- **LangGraph** - Graph-based orchestration for complex RAG workflows
- **Pinecone** - Vector database for document embeddings
- **Google AI Studio** - LLM and embedding models

## Prerequisites

- Node.js (v16 or higher)
- Python 3.13.3
- Pinecone account
- Google AI Studio account

## Installation

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Fill in the environment variables in `.env`

5. Start the development server:

```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a Python virtual environment:

```bash
# Using VS Code
# Press Ctrl+Shift+P -> "Python: Create Environment" -> Select Python 3.13.3

# Or using command line
python -m venv .venv
```

3. Activate the virtual environment:

```bash
# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. **Set up Pinecone:**

   - Go to [Pinecone Console](https://app.pinecone.io/)
   - Create a new account or sign in
   - Create a new index:
     - Click "Create Index"
     - Choose a name for your index
     - Set dimension (must match embedding model dimension) for example in the .env.example the embeddings **models/text-embedding-004** is and the corresponding dimension is **768**
     - Choose your preferred metric (cosine recommended)
     - Select your cloud provider and region (aws for free)
   - Generate API key:
     - Go to "API Keys" section
     - Click "Create API Key"
     - Copy the generated key
   - Note your index name for the environment configuration

   **⚠️ Important**: Make sure your Pinecone index dimension matches your embedding model. The default configuration uses dimension 768.

6. **Set up Google AI Studio:**

   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Sign in with your Google account
   - Navigate to "API Key" section
   - Click "Create API Key"
   - Copy the generated API key

7. Create environment file:

```bash
cp .env.example .env
```

8. Fill in your `.env` file with the required values:

```env
# LLMs models
GOOGLE_API_KEY="your_google_api_key_here"
GOOGLE_EMBEDDING_MODEL="models/text-embedding-004"
GOOGLE_GEMINI_MODEL="models/gemini-2.5-flash-preview-05-20"

# Sqlite db
SQL_LITE_DB_URL="sqlite:///./dbfile.db"
secret_key="your_secret_key_here"

# Token config
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=5
ALGORITHM="HS256"

# Pinecone vector db
PINECONE_API_KEY="your_pinecone_api_key_here"
PINECONE_INDEX_NAME="your_pinecone_index_name_here"
```

9. Start the backend server:

```bash
cd backend/app
uvicorn main:app --reload
```

## Usage

1. **Create a Chat**: Start by creating a new chat session and uploading your documents
2. **Ask Questions**: Query your documents using natural language
3. **Compare Algorithms**: Test different RAG algorithms to see which works best for your use case
4. **View Results**: See retrieved documents alongside the generated responses
5. **Generate Code**: Export your preferred algorithm as a Jupyter notebook

## Environment Configuration

### Backend (.env)

- `GOOGLE_API_KEY`: Your Google AI Studio API key
- `GOOGLE_EMBEDDING_MODEL`: Embedding model for document vectorization
- `GOOGLE_GEMINI_MODEL`: LLM model for response generation
- `SQL_LITE_DB_URL`: SQLite database connection string
- `secret_key`: JWT secret key for authentication
- `PINECONE_API_KEY`: Your Pinecone API key
- `PINECONE_INDEX_NAME`: Name of your Pinecone index

### Frontend (.env)

Configure according to your `.env.example` file in the frontend directory.

## API Endpoints

The FastAPI backend provides RESTful endpoints for:

- User authentication
- Chat management
- Document upload and processing
- RAG algorithm execution
- Code generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please contact me directly.
