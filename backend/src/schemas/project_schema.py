from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from backend.src.utils.pydantic.generate_partial_model import generate_partial_model

class ProjectBase(BaseModel):
    title: str
    description: str
    client_id: int
    status: Optional[str] = "pending"
    
    class ConfigDict:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str
    description: str
    client_id: int

class ProjectUpdate(generate_partial_model(ProjectCreate, model_name="ProjectUpdate")):
    status: Optional[str] = None
    pass

class ProjectDisplay(BaseModel):
    id: int
    title: str
    description: str
    status: str
    client_id: int
    created_at: datetime
    updated_at: datetime
    
    class ConfigDict:
        from_attributes = True
