from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProjectMinimal(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True

class InvoiceBase(BaseModel):
    invoice_number: str
    amount: int
    description: Optional[str] = None
    status: str = "unpaid"
    due_date: Optional[datetime] = None
    project_id: int

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    amount: Optional[int] = None
    description: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None

class InvoiceDisplay(InvoiceBase):
    id: int
    created_at: datetime
    # Nested project detail for the UI tables
    project: Optional[ProjectMinimal] = None

    class Config:
        from_attributes = True
