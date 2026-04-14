from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from backend.src.db.database import get_db
from backend.src.schemas.project_schema import ProjectBase, ProjectCreate, ProjectDisplay, ProjectUpdate, CriteriaHistoryDisplay
from backend.src.db import db_project
from backend.src.schemas.user_schema import UserDisplay
from backend.src.utils.auth_service.oauth2_util import get_current_user
from backend.src.db.models import RoleEnum

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("", response_model=ProjectDisplay, status_code=status.HTTP_201_CREATED)
def create_project(request: ProjectCreate, db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    if current_user.role != RoleEnum.admin.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can initialize new projects."
        )
    return db_project.create_project(db, request)

@router.get("", response_model=List[ProjectDisplay])
def get_all_projects(db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    # Admins get all, clients get theirs
    if current_user.role == RoleEnum.admin.value:
        return db_project.get_all_projects(db)
    return db_project.get_projects_by_client(db, current_user.id)

@router.get("/{id}", response_model=ProjectDisplay)
def get_project(id: int, db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    project = db_project.get_project_by_id(db, id)
    
    # Ownership/Admin check
    if current_user.role != RoleEnum.admin.value and project.client_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this project details."
        )
    return project

@router.get("/{id}/history", response_model=List[CriteriaHistoryDisplay])
def get_project_history(id: int, db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    project = db_project.get_project_by_id(db, id)
    # RBAC check
    if current_user.role != RoleEnum.admin.value and project.client_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project's history.")
    return db_project.get_criteria_history(db, id)

@router.put("/{id}", response_model=ProjectDisplay)
def update_project(id: int, request: ProjectUpdate, db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    project = db_project.get_project_by_id(db, id)
    
    # Ownership Check
    if current_user.role != RoleEnum.admin.value and project.client_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to modify this project.")

    # Strict Field Locking for Clients
    if current_user.role == RoleEnum.client.value:
        allowed_fields = {"description", "acceptance_criteria"}
        input_data = request.model_dump(exclude_unset=True)
        for field in input_data:
            if field not in allowed_fields:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, 
                    detail=f"Clients are not permitted to modify the '{field}' field."
                )
    
    return db_project.update_project(db, id, request, current_user.id)

@router.delete("/{id}")
def delete_project(id: int, db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    if current_user.role != RoleEnum.admin.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can remove projects."
        )
    return db_project.delete_project(db, id)
