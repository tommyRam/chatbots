from fastapi import APIRouter
# from .services import upload_file_to_folder, download_file

router = APIRouter(
    prefix="/api/chat"
)

@router.post("/docs/upload-drive")
async def upload_to_drive():
    pass