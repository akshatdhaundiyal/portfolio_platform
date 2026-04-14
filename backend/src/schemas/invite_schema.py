from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class InviteCodeBase(BaseModel):
    code: str

class InviteCodeCreate(BaseModel):
    # Admin doesn't necessarily need to pass a code, we can generate it
    pass

class InviteCodeDisplay(BaseModel):
    id: int
    code: str
    is_used: bool
    created_at: datetime
    created_by: Optional[int] = None
    used_by: Optional[int] = None

    class ConfigDict:
        from_attributes = True
