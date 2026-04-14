from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.src.db.database import get_db
from backend.src.schemas.user_schema import UserBase, UserDisplay, UserUpdate, UserRegister
from backend.src.db import db_user, db_invite
from backend.src.utils.auth_service.oauth2_util import get_current_user
from backend.src.config import settings
from backend.src.db.models import RoleEnum


router = APIRouter()

from sqlalchemy.exc import IntegrityError

@router.post("/register", response_model=UserDisplay)
def register_user(request: UserRegister, db: Session = Depends(get_db)):
    """
    Public registration endpoint. Requires a valid invite code or bootstrap secret.
    """
    # Normalize both for comparison (ignore accidental whitespace)
    input_code = request.invite_code.strip()
    config_secret = settings.bootstrap_secret.strip() if settings.bootstrap_secret else None
    
    is_bootstrap = (config_secret and input_code == config_secret)
    invite = None
    
    if is_bootstrap:
        role = RoleEnum.admin.value
    else:
        invite = db_invite.validate_invite_code(db, request.invite_code)
        if not invite:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid invitation code. Please contact an administrator."
            )
        role = RoleEnum.client.value

    # Convert UserRegister to UserBase format for original creation logic
    user_data = UserBase(
        username=request.username,
        email=request.email,
        password=request.password,
        fullname=request.fullname,
        role=role
    )
    
    try:
        new_user = db_user.create_user(db, request=user_data)
        
        # Mark code as used if it was a real database invite
        if invite:
            db_invite.mark_invite_as_used(db, request.invite_code, new_user.id)
            
        return new_user
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists. Please choose another or login."
        )

@router.post("/create", response_model=UserDisplay)
def create_user(request: UserBase, db: Session = Depends(get_db), current_user: UserDisplay = Depends(get_current_user)):
    """
    Endpoint for admins to manually create a user.
    """
    if current_user.role != RoleEnum.admin.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can manually create users.")
    return db_user.create_user(db, request=request)

@router.post('/update',response_model=UserDisplay)
def update_user(request: UserUpdate, db: Session = Depends(get_db),current_user: UserBase = Depends(get_current_user)):
    """
    Endpoint to update user details.
    """
    # Logic to update user details would go here
    check_request_id = db_user.get_user_by_username(db, username=request.backup_username)
    if not check_request_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if current_user.id != check_request_id.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only update your own details.")
    request.id = check_request_id.id
    return db_user.update_user_details(db, request=request)