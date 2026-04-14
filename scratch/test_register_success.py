import sys
import os
sys.path.append(os.getcwd())

from backend.src.db.database import SessionLocal
from backend.src.routers.users.user_post import register_user
from backend.src.schemas.user_schema import UserRegister
from backend.src.db.db_invite import create_invite_code, get_all_invites
from backend.src.db.db_user import get_user_by_username
from fastapi import HTTPException

db = SessionLocal()

# Cleanup previous test if exists
existing = get_user_by_username(db, "test_success_1")
if existing:
    from sqlalchemy import text
    db.execute(text("DELETE FROM users WHERE username = 'test_success_1'"))
    db.commit()

# 1. Create a special test admin if not exists (to generate invite)
admin = get_user_by_username(db, "admin")
if not admin:
    print("No admin found to create invite.")
    sys.exit(1)

# 2. Generate a fresh invite
invite_obj = create_invite_code(db, admin_id=admin.id)
valid_code = invite_obj.code
print(f"Generated valid code: {valid_code}")

# 3. Attempt registration with the valid code
req = UserRegister(
    username="test_success_1", 
    email="test_success_1@example.com", 
    password="password123", 
    fullname="Test Success", 
    invite_code=valid_code
)

print("Attempting registration with valid code...")
try:
    res = register_user(req, db)
    print(f"Registration SUCCEEDED: User ID {res.id}")
except Exception as e:
    print("CRASH DETECTED!")
    import traceback
    traceback.print_exc()
finally:
    db.close()
