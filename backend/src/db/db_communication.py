from sqlalchemy.orm import Session
from src.db.models import DbCommunication
from src.schemas.communication_schema import CommunicationCreate
from fastapi import HTTPException, status

def create_communication(db: Session, request: CommunicationCreate, sender_id: int):
    new_comm = DbCommunication(
        message=request.message,
        project_id=request.project_id,
        sender_id=sender_id
    )
    db.add(new_comm)
    db.commit()
    db.refresh(new_comm)
    return new_comm

def get_communications_by_project(db: Session, project_id: int):
    return db.query(DbCommunication).filter(DbCommunication.project_id == project_id).order_by(DbCommunication.created_at.asc()).all()
