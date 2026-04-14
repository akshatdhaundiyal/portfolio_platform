from fastapi import Depends, FastAPI
from backend.src.db.database import engine,get_db
from backend.src.routers import projects, communications, invoices
from backend.src.routers.users import user
from backend.src.db import models
from backend.src.utils.auth_service import authentication
from fastapi.staticfiles import StaticFiles

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    dependencies=[Depends(get_db)]
)

from backend.src.config import settings
print(f"🚀 API starting up... Connected to: {settings.database_url}")

# Configure CORS for local development and production
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://*cloud.run",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, # Required for Cookie storage
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router)
app.include_router(communications.router)
app.include_router(user.router)
app.include_router(authentication.router)

@app.get("/")
def root():
    """
    Root endpoint for the portfolio platform
    """
    return {"message": "Welcome to the portfolio platform!"}

models.Base.metadata.create_all(engine)

import os

# Ensure the images directory exists to prevent Starlette/FastAPI startup errors
os.makedirs("backend/images", exist_ok=True)
app.mount("/images", StaticFiles(directory="backend/images"), name="images")