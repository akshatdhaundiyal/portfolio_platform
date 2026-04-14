from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.src.db.database import get_db
from backend.src.schemas.invite_schema import InviteCodeDisplay, InviteCodeCreate
from backend.src.db import db_invite
from backend.src.utils.auth_service.oauth2_util import get_current_user
from backend.src.schemas.user_schema import UserDisplay
from backend.src.db.models import RoleEnum

router = APIRouter(
    prefix="/invites",
    tags=["invites"]
)

@router.post("/", response_model=InviteCodeDisplay)
def create_invite(db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    """
    Generate a new invite code. Admin only.
    """
    if current_user.role != RoleEnum.admin.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can generate invitation codes."
        )
    return db_invite.create_invite_code(db, admin_id=current_user.id)

@router.get("/", response_model=List[InviteCodeDisplay])
def list_invites(db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    """
    List all invite codes. Admin only.
    """
    if current_user.role != RoleEnum.admin.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can view invitation codes."
        )
    return db_invite.get_all_invites(db)
