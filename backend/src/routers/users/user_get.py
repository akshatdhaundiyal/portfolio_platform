from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.src.db.database import get_db
from backend.src.schemas.user_schema import UserDisplay
from backend.src.db import db_user
from backend.src.utils.auth_service.oauth2_util import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserDisplay)
def get_me(current_user: UserDisplay = Depends(get_current_user)):
    """
    Returns the currently authenticated user's profile.
    """
    return current_user

@router.get("/", response_model=List[UserDisplay])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: UserDisplay = Depends(get_current_user)
):
    """
    Endpoint to retrieve all users. Only accessible by admins.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access the user list"
        )
    users = db_user.get_all_users(db)
    print(f"DEBUG: Found {len(users)} users for admin request")
    return users

@router.get("/clients", response_model=List[UserDisplay])
def get_all_clients(
    db: Session = Depends(get_db),
    current_user: UserDisplay = Depends(get_current_user)
):
    """
    Endpoint to retrieve all clients. Only accessible by admins.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access the client list"
        )
    clients = db_user.get_all_clients(db)
    print(f"DEBUG: Found {len(clients)} clients for admin request")
    return clients

@router.get("/{id}",response_model=UserDisplay)
def get_user_by_id(id: int,db: Session = Depends(get_db)):
    """
    Endpoint to get a specific user by ID.
    """
    return db_user.get_user_by_id(id=id)