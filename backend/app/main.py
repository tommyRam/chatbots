from fastapi import FastAPI
from llms_router.rag_api import router as rag_router
from router.api import router as app_router

from database import Base, engine

Base.metadata.create_all(bind=engine)

def create_app():
    app = FastAPI(
        title="RAG application"
    )   

    app.include_router(router=rag_router)
    app.include_router(router=app_router)
    return app

app = create_app()

@app.get("/")
async def get_root():
    return {"message": "Welcome to my beautiful rag application"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


