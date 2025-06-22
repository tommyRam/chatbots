import os
from googleapiclient.discovery import build
from google.oauth2 import service_account
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
from googleapiclient.errors import HttpError
import io

from config import settings

current_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(current_dir,"..", "llms_router", "dev_data_api", "Be_Good.pdf")
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

# TODO: change file_path for the file to upload into the real file from user (frontend)
def upload_file_to_drive_folder(file_name: str):
    folder_id = settings.PARENT_FOLDER_GOOGLE_DRIVE_ID
    file_metadata = {
        'name': file_name,
        'parents': [folder_id]
    }
    media = MediaFileUpload(file_path, resumable=True)
    uploaded_file = drive_service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id, name'
    ).execute()
    print(f"Uploaded file: {uploaded_file['name']} (ID: {uploaded_file['id']})")
    return {"file_name": file_name, "file_id": uploaded_file['id']}

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
    # output_file_name = "downloaded_file.pdf"
    # with open(output_file_name, 'wb') as f:
    #    f.write(binary_file)
    return binary_file
  except HttpError as error:
    print(f"An error occurred: {error}")
    file = None