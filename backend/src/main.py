from fastapi import Depends, FastAPI
from src.db.database import engine,get_db
from src.routers import projects, communications, invoices, invites
from src.routers.users import user
from src.db import models
from src.utils.auth_service import authentication

from fastapi.staticfiles import StaticFiles

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    dependencies=[Depends(get_db)]
)

# Standard middleware for handling Cloud Run / Proxy SSL termination
@app.middleware("http")
async def add_process_time_header(request, call_next):
    # Ensure all responses are perceived as HTTPS by the browser if the proxy says so
    if request.headers.get("x-forwarded-proto") == "https":
        request.scope["scheme"] = "https"
    response = await call_next(request)
    return response

from src.config import settings
print(f"API starting up... Connected to: {settings.database_url}")

# Configure CORS for local development and production
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://portfolio-frontend-501015394738.us-east1.run.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, # Required for Cookie storage
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# DEBUG: Verbose Error Handler (Remove before production)
# ---------------------------------------------------------
import traceback
from fastapi.responses import JSONResponse
from fastapi import Request

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Determine the origin to allow browser to read the debug error
    origin = request.headers.get("origin")
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "traceback": traceback.format_exc(),
            "path": request.url.path
        },
        headers={
            "Access-Control-Allow-Origin": origin if origin else "*",
            "Access-Control-Allow-Credentials": "true"
        }
    )
# ---------------------------------------------------------

app.include_router(projects.router)
app.include_router(communications.router)
app.include_router(user.router)
app.include_router(authentication.router)
app.include_router(invites.router)

@app.get("/")
def root():
    """
    Root endpoint for the portfolio platform
    """
    return {
        "message": "Welcome to the portfolio platform!",
        "database_connected": True if settings.database_url else False
    }

# Initialization logic moved to the bottom to ensure all models are discovered
import os
os.makedirs("images", exist_ok=True)
app.mount("/images", StaticFiles(directory="images"), name="images")

print("Initializing database schema...")
models.Base.metadata.create_all(engine)
print("Database schema initialized.")

def dev():
    import uvicorn
    uvicorn.run("backend.src.main:app", host="0.0.0.0", port=8000, reload=True)
