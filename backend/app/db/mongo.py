import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "bookcafe")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[MONGODB_DB_NAME]


def get_db():
    return db
