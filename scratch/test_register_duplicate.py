import sys
import os
sys.path.append(os.getcwd())

from backend.src.db.database import SessionLocal
from backend.src.routers.users.user_post import register_user
from backend.src.schemas.user_schema import UserRegister
from backend.src.db.db_invite import create_invite_code
from backend.src.db.db_user import get_user_by_username
from sqlalchemy.exc import IntegrityError

db = SessionLocal()

# Cleanup previous test if exists
existing = get_user_by_username(db, "test_dup_1")
if existing:
    from sqlalchemy import text
    db.execute(text("DELETE FROM users WHERE email = 'test_dup_1@example.com'"))
    db.commit()

admin = get_user_by_username(db, "admin")
invite_1 = create_invite_code(db, admin_id=admin.id)
invite_2 = create_invite_code(db, admin_id=admin.id)

req_1 = UserRegister(username="test_dup_1", email="test_dup_1@example.com", password="pass", fullname="D1", invite_code=invite_1.code)
req_2 = UserRegister(username="test_dup_2", email="test_dup_1@example.com", password="pass", fullname="D2", invite_code=invite_2.code)

print("Registering first user...")
register_user(req_1, db)
print("First user registered.")

print("Attempting to register second user with SAME EMAIL...")
try:
    register_user(req_2, db)
    print("Registration SUCCEEDED? (Should have failed)")
except IntegrityError as e:
    print("CAUGHT INTEGRITY ERROR (500 in FastAPI if unhandled)")
    # traceback.print_exc()
except Exception as e:
    print(f"Caught other error: {type(e).__name__}")
finally:
    db.close()
