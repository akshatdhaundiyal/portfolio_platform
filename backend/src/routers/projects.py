from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.src.db.database import get_db
from backend.src.schemas.project_schema import ProjectBase, ProjectCreate, ProjectDisplay, ProjectUpdate
from backend.src.db import db_project
from backend.src.schemas.user_schema import UserDisplay
from backend.src.utils.auth_service.oauth2 import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/", response_model=ProjectDisplay, status_code=status.HTTP_201_CREATED)
def create_project(request: ProjectCreate, db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    # In a real app we'd verify that current_user is an admin
    return db_project.create_project(db, request)

@router.get("/", response_model=List[ProjectDisplay])
def get_all_projects(db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    # Admins get all, clients get theirs
    if current_user.role == "admin":
        return db_project.get_all_projects(db)
    return db_project.get_projects_by_client(db, current_user.id)

@router.get("/{id}", response_model=ProjectDisplay)
def get_project(id: int, db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    project = db_project.get_project_by_id(db, id)
    # Check permissions conceptually
    return project

@router.put("/{id}", response_model=ProjectDisplay)
def update_project(id: int, request: ProjectUpdate, db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    return db_project.update_project(db, id, request)

@router.delete("/{id}")
def delete_project(id: int, db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    return db_project.delete_project(db, id)
