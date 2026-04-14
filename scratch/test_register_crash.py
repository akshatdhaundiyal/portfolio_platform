import sys
import os
sys.path.append(os.getcwd())

from backend.src.db.database import SessionLocal
from backend.src.routers.users.user_post import register_user
from backend.src.schemas.user_schema import UserRegister
from fastapi import HTTPException

db = SessionLocal()
# Attempt to register with a bogus invite code to see if it raises correctly or crashes
req = UserRegister(
    username="test_crash_1", 
    email="test_crash_1@example.com", 
    password="password123", 
    fullname="Test Crash", 
    invite_code="BOGUS_CODE"
)

print("Attempting registration...")
try:
    res = register_user(req, db)
    print("Registration succeeded?")
except HTTPException as e:
    print(f"Caught expected HTTPException: {e.status_code} - {e.detail}")
except Exception as e:
    print("CRASH DETECTED!")
    import traceback
    traceback.print_exc()
finally:
    db.close()
