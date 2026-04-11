from pydantic import BaseModel
from datetime import datetime

class CommunicationBase(BaseModel):
    message: str
    project_id: int
    
    class ConfigDict:
        from_attributes = True

class CommunicationCreate(BaseModel):
    message: str
    project_id: int

class CommunicationDisplay(BaseModel):
    id: int
    message: str
    sender_id: int
    project_id: int
    created_at: datetime
    
    class ConfigDict:
        from_attributes = True
