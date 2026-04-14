from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from backend.src.utils.pydantic.generate_partial_model import generate_partial_model

class ProjectBase(BaseModel):
    title: str
    description: str
    client_id: int
    status: Optional[str] = "pending"
    trello_url: Optional[str] = None
    github_url: Optional[str] = None
    github_token: Optional[str] = None
    wip_url: Optional[str] = None
    start_date: Optional[datetime] = None
    acceptance_criteria: Optional[str] = None
    
    class ConfigDict:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str
    description: str
    client_id: int
    trello_url: Optional[str] = None
    github_url: Optional[str] = None
    github_token: Optional[str] = None
    wip_url: Optional[str] = None
    start_date: Optional[datetime] = None
    acceptance_criteria: Optional[str] = None

class ProjectUpdate(generate_partial_model(ProjectBase, model_name="ProjectUpdate")):
    pass

class ProjectDisplay(BaseModel):
    id: int
    title: str
    description: str
    status: str
    client_id: int
    trello_url: Optional[str] = None
    github_url: Optional[str] = None
    github_token: Optional[str] = None
    wip_url: Optional[str] = None
    start_date: Optional[datetime] = None
    acceptance_criteria: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class ConfigDict:
        from_attributes = True

class CriteriaHistoryDisplay(BaseModel):
    id: int
    project_id: int
    content: str
    created_by: Optional[int]
    created_at: datetime
    author_name: Optional[str] = None

    class ConfigDict:
        from_attributes = True
