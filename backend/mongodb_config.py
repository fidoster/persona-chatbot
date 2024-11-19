from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def get_mongo_client():
    try:
        # Fetch MongoDB connection string from the environment variables
        MONGODB_URI = os.getenv("MONGODB_URI")

        # Check if MONGODB_URI is missing
        if not MONGODB_URI:
            raise ValueError("MONGODB_URI is not set in the .env file")

        # Initialize and return the MongoDB client
        client = MongoClient(MONGODB_URI)
        return client
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise

def get_db():
    try:
        # Get the MongoDB client and return the specified database
        client = get_mongo_client()
        return client["edubot"]
    except Exception as e:
        print(f"Error accessing the database: {e}")
        raise
