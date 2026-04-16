from src.db.database import engine, Base
from src.db.models import DbUser, DbProject, DbCommunication, DbInvoice, DbProjectFile, DbInviteCode, DbCriteriaHistory
from src.db.seed import seed_db

def reset_and_seed():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Seeding database...")
    seed_db()
    print("Database reset complete.")

if __name__ == "__main__":
    reset_and_seed()
