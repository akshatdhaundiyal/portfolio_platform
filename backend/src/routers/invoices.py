from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.src.db.database import get_db
from backend.src.db import db_invoice
from backend.src.schemas.invoice_schema import InvoiceCreate, InvoiceUpdate, InvoiceDisplay
from backend.src.utils.auth_service.oauth2_util import get_current_user
from backend.src.schemas.user_schema import UserDisplay

router = APIRouter(prefix="/invoices", tags=["invoices"])

@router.post("/", response_model=InvoiceDisplay)
def create_invoice(
    request: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: UserDisplay = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can create invoices")
    return db_invoice.create_invoice(db, request)

@router.get("/", response_model=List[InvoiceDisplay])
def get_all_invoices(
    db: Session = Depends(get_db),
    current_user: UserDisplay = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return db_invoice.get_all_invoices(db)

@router.get("/me", response_model=List[InvoiceDisplay])
def get_my_invoices(
    db: Session = Depends(get_db),
    current_user: UserDisplay = Depends(get_current_user)
):
    return db_invoice.get_invoices_by_client(db, current_user.id)

@router.patch("/{id}", response_model=InvoiceDisplay)
def update_invoice(
    id: int,
    request: InvoiceUpdate,
    db: Session = Depends(get_db),
    current_user: UserDisplay = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can update invoices")
    return db_invoice.update_invoice(db, id, request)

@router.delete("/{id}")
def delete_invoice(
    id: int,
    db: Session = Depends(get_db),
    current_user: UserDisplay = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can delete invoices")
    return db_invoice.delete_invoice(db, id)
