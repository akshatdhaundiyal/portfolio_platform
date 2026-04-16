from sqlalchemy.orm import Session
from src.db.models import DbInvoice, DbProject
from src.schemas.invoice_schema import InvoiceCreate, InvoiceUpdate
from fastapi import HTTPException, status
import datetime

def create_invoice(db: Session, request: InvoiceCreate):
    # Verify project exists
    project = db.query(DbProject).filter(DbProject.id == request.project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    new_invoice = DbInvoice(
        invoice_number=request.invoice_number,
        amount=request.amount,
        description=request.description,
        status=request.status,
        due_date=request.due_date,
        project_id=request.project_id
    )
    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)
    return new_invoice

def get_all_invoices(db: Session):
    return db.query(DbInvoice).order_by(DbInvoice.created_at.desc()).all()

def get_invoices_by_client(db: Session, client_id: int):
    # Join with projects to filter by client_id
    return db.query(DbInvoice)\
        .join(DbProject)\
        .filter(DbProject.client_id == client_id)\
        .order_by(DbInvoice.created_at.desc())\
        .all()

def update_invoice(db: Session, invoice_id: int, request: InvoiceUpdate):
    invoice = db.query(DbInvoice).filter(DbInvoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    
    for field, value in request.model_dump().items():
        if value is not None:
            setattr(invoice, field, value)
    
    db.commit()
    db.refresh(invoice)
    return invoice

def delete_invoice(db: Session, invoice_id: int):
    invoice = db.query(DbInvoice).filter(DbInvoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    db.delete(invoice)
    db.commit()
    return "Invoice deleted"
