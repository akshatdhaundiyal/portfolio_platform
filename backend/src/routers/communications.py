from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.src.db.database import get_db
from backend.src.schemas.communication_schema import CommunicationCreate, CommunicationDisplay
from backend.src.db import db_communication
from backend.src.schemas.user_schema import UserDisplay
from backend.src.utils.auth_service.oauth2 import get_current_user

router = APIRouter(prefix="/communications", tags=["communications"])

@router.post("/", response_model=CommunicationDisplay, status_code=status.HTTP_201_CREATED)
def create_communication(request: CommunicationCreate, db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    return db_communication.create_communication(db, request, sender_id=current_user.id)

@router.get("/project/{project_id}", response_model=List[CommunicationDisplay])
def get_communications_by_project(project_id: int, db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    return db_communication.get_communications_by_project(db, project_id)
