import os
from urllib.parse import urlparse

import certifi
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.server_api import ServerApi


load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is not configured")

_parsed_uri = urlparse(MONGO_URI)
_database_name = _parsed_uri.path.lstrip("/") or "edumonitor_ai"

# One process-wide MongoClient. PyMongo clients are thread-safe and should be reused.
client = MongoClient(
    MONGO_URI,
    server_api=ServerApi("1"),
    tls=True,
    tlsCAFile=certifi.where(),
    connect=False,
    serverSelectionTimeoutMS=10000,
)

db = client[_database_name]


def ping_mongo():
    client.admin.command("ping")
    return True
