import os
from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", 5000))
JWT_SECRET = os.getenv("JWT_SECRET", "skillbridge_super_secure_jwt_secret_key_2026_cse494")
JWT_ALGORITHM = "HS256"
CLIENT_URL = os.getenv("CLIENT_URL", "http://localhost:5173")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
