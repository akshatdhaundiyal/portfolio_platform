import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.src.config import settings
from backend.src.db.models import DbUser, DbProject

def check_db():
    print(f"DATABASE_URL: {settings.database_url}")
    engine = create_engine(settings.database_url)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    users = db.query(DbUser).all()
    projects = db.query(DbProject).all()
    
    print(f"Total Users: {len(users)}")
    for u in users:
        print(f" - {u.username} (role: {u.role})")
        
    print(f"Total Projects: {len(projects)}")
    for p in projects:
        print(f" - {p.title}")
    
    db.close()

if __name__ == "__main__":
    check_db()
