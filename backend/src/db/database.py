from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from src.config import settings

# Constructing the database URL
DATABASE_URL = settings.database_url

# For PostgreSQL (e.g. Neon), ensure sslmode=require is appended for remote connections
if DATABASE_URL.startswith("postgresql") and "sslmode=" not in DATABASE_URL:
    is_local = "localhost" in DATABASE_URL or "127.0.0.1" in DATABASE_URL or "db" in DATABASE_URL
    if not is_local:

        separator = "&" if "?" in DATABASE_URL else "?"
        DATABASE_URL += f"{separator}sslmode=require"

# Creating the SQLAlchemy engine
# If the URL is sqlite (local), we need specific threading arguments. If postgres (Neon), we don't.
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False},
        execution_options={"sqlite_pragma_foreign_keys": True}
    )
else:
    engine = create_engine(DATABASE_URL)

# Creating a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
