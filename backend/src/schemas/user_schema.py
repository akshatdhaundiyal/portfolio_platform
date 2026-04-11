from typing import Optional
from pydantic import BaseModel

from backend.src.utils.pydantic.generate_partial_model import generate_partial_model

class UserBase(BaseModel):
    username: str
    email: str
    password: str
    fullname: Optional[str] = None
    bio: Optional[str] = None
    role: Optional[str] = "client"
    
    class ConfigDict:
        from_attributes = True

class UserUpdate(generate_partial_model(UserBase, model_name="UserUpdate")):
    backup_username: str
    id: Optional[int] = None
    pass

class UserDisplay(BaseModel):
    id: int
    username: str
    email: str
    fullname: Optional[str] = None
    bio: Optional[str] = None
    role: str
    
    class ConfigDict:
        from_attributes = True