from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID
import os
client = Client()

(client
    .set_endpoint(os.getenv("APPWRITE_ENDPOINT")) # or your self-hosted URL
    .set_project(os.getenv("APPWRITE_PROJECT_ID")) # your project ID
    .set_key(os.getenv("APPWRITE_API_KEY"))
)

def add_scheduled_video(video_data):
    databases = Databases(client)    
    # Validate required fields
    if not video_data.get('userId'):
        print("userId is missing in video_data")
        raise ValueError("userId is required")
    
    response = databases.create_document(
        database_id=os.getenv("APPWRITE_DATABASE_ID"),
        collection_id=os.getenv("APPWRITE_COLLECTION_ID"),
        document_id=ID.unique(),
        data=video_data
    )
    return response
def get_scheduled_videos():
    databases = Databases(client)    
    response = databases.list_documents(
        database_id=os.getenv("APPWRITE_DATABASE_ID"),
        collection_id=os.getenv("APPWRITE_COLLECTION_ID")
    )
    return response

def delete_scheduled_video(document_id):
    databases = Databases(client)    
    response = databases.delete_document(
        database_id=os.getenv("APPWRITE_DATABASE_ID"),
        collection_id=os.getenv("APPWRITE_COLLECTION_ID"),
        document_id=document_id
    )
    return response
