from sqlalchemy.orm import Session
from src.db.models import DbProject, DbCriteriaHistory, DbUser
from src.schemas.project_schema import ProjectCreate, ProjectUpdate
from fastapi import HTTPException, status

def create_project(db: Session, request: ProjectCreate):
    new_project = DbProject(
        title=request.title,
        description=request.description,
        client_id=request.client_id,
        trello_url=request.trello_url,
        github_url=request.github_url,
        github_token=request.github_token,
        wip_url=request.wip_url,
        start_date=request.start_date,
        acceptance_criteria=request.acceptance_criteria
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

def update_project(db: Session, project_id: int, request: ProjectUpdate, current_user_id: int):
    project = db.query(DbProject).filter(DbProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    # Check if acceptance_criteria is changing to log history
    old_criteria = project.acceptance_criteria
    new_criteria = getattr(request, 'acceptance_criteria', None)
    
    should_log_history = False
    if new_criteria is not None and new_criteria != old_criteria:
        should_log_history = True

    for field, value in request.model_dump().items():
        if value is not None and hasattr(project, field):
            setattr(project, field, value)
    
    if should_log_history:
        history_entry = DbCriteriaHistory(
            project_id=project.id,
            content=project.acceptance_criteria,
            created_by=current_user_id
        )
        db.add(history_entry)

    db.commit()
    db.refresh(project)
    return project

def get_criteria_history(db: Session, project_id: int):
    results = db.query(DbCriteriaHistory).filter(DbCriteriaHistory.project_id == project_id).order_by(DbCriteriaHistory.created_at.desc()).all()
    # Enrich with author name for display convenience
    history = []
    for item in results:
        author = db.query(DbUser).filter(DbUser.id == item.created_by).first()
        history.append({
            "id": item.id,
            "project_id": item.project_id,
            "content": item.content,
            "created_by": item.created_by,
            "created_at": item.created_at,
            "author_name": author.fullname or author.username if author else "Unknown"
        })
    return history

def delete_project(db: Session, project_id: int):
    project = db.query(DbProject).filter(DbProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    db.delete(project)
    db.commit()
    return "Project deleted"
