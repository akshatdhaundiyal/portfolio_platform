import secrets
import string
from sqlalchemy.orm import Session
from backend.src.db.models import DbInviteCode
from fastapi import HTTPException, status

def generate_random_code(length=12):
    """Generate a high-entropy random string for invite codes."""
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def create_invite_code(db: Session, admin_id: int):
    """Create a new un-used invite code."""
    new_code = DbInviteCode(
        code=generate_random_code(),
        created_by=admin_id
    )
    db.add(new_code)
    db.commit()
    db.refresh(new_code)
    return new_code

def get_all_invites(db: Session):
    """Retrieve all invite codes for admin viewing."""
    return db.query(DbInviteCode).order_by(DbInviteCode.created_at.desc()).all()

def validate_invite_code(db: Session, code: str):
    """Return an un-used invite code if valid, else raise Exception."""
    invite = db.query(DbInviteCode).filter(DbInviteCode.code == code).first()
    
    if not invite:
        return None
    
    if invite.is_used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This invite code has already been used."
        )
        
    return invite

def mark_invite_as_used(db: Session, code: str, user_id: int):
    """Mark an invite code as used by a specific user."""
    invite = db.query(DbInviteCode).filter(DbInviteCode.code == code).first()
    if invite:
        invite.is_used = True
        invite.used_by = user_id
        db.commit()
        db.refresh(invite)
    return invite
