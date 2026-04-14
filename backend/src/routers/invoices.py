from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.src.db.database import get_db
from backend.src.db.models import DbInvoice
from backend.src.utils.auth_service.oauth2_util import get_current_user
from backend.src.schemas.user_schema import UserDisplay

router = APIRouter(prefix="/invoices", tags=["invoices"])

@router.get("/")
def get_all_invoices(
    db: Session = Depends(get_db),
    current_user: UserDisplay = Depends(get_current_user)
):
    """
    Retrieve all invoices. Only accessible by admins.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access the invoice list"
        )
    
    invoices = db.query(DbInvoice).all()
    return invoices
