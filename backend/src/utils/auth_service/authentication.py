from fastapi import APIRouter, Depends, HTTPException,status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import or_
from src.db.database import get_db
from src.db.db_user import update_last_login
from src.db.models import DbUser
from src.utils.auth_service import oauth2_util
from src.utils.auth_service.hash import Hash

router = APIRouter(
    tags=["authentication"],
    dependencies=[Depends(get_db)]
)

from sqlalchemy import or_, func

@router.post("/token")
def get_token(request: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):
    """
    Endpoint to retrieve an authentication token.
    """
    # Logic to authenticate user and return token (support username or email, case-insensitive)
    user = db.query(DbUser).filter(
        or_(
            func.lower(DbUser.username) == func.lower(request.username),
            func.lower(DbUser.email) == func.lower(request.username)
        )
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    if not Hash.verify(user.password, request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = oauth2_util.create_access_token(data={"sub": str(user.id)})

    # Update last login time
    update_last_login(db, user_id=user.id)
    
    return {"access_token": access_token,
             "token_type": "bearer",
                "user_id": user.id,
                "username": user.username
             }
    
