from fastapi import Depends, FastAPI
from backend.src.db.database import engine,get_db
from backend.src.routers import projects, communications
from backend.src.routers.users import user
from backend.src.db import models
from backend.src.utils.auth_service import authentication
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    dependencies=[Depends(get_db)]
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