from sqlalchemy.orm import Session
from backend.src.db.models import DbProject
from backend.src.schemas.project_schema import ProjectCreate, ProjectUpdate
from fastapi import HTTPException, status

def create_project(db: Session, request: ProjectCreate):
    new_project = DbProject(
        title=request.title,
        description=request.description,
        client_id=request.client_id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

def get_all_projects(db: Session):
    return db.query(DbProject).all()

def get_project_by_id(db: Session, project_id: int):
    project = db.query(DbProject).filter(DbProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project

def get_projects_by_client(db: Session, client_id: int):
    return db.query(DbProject).filter(DbProject.client_id == client_id).all()

def update_project(db: Session, project_id: int, request: ProjectUpdate):
    project = db.query(DbProject).filter(DbProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    for field, value in request.model_dump().items():
        if value is not None and hasattr(project, field):
            setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    return project

def delete_project(db: Session, project_id: int):
    project = db.query(DbProject).filter(DbProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    db.delete(project)
    db.commit()
    return "Project deleted"
