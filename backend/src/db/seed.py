from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from backend.src.db.database import SessionLocal, engine
from backend.src.db.models import DbUser, DbProject, DbCommunication, DbInvoice, RoleEnum, ProjectStatus, Base
from backend.src.utils.auth_service.hash import Hash

def seed_db():
    db: Session = SessionLocal()
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    print("Seeding database...")
    
    # 1. Create a Test Client User
    client_name = "john_client"
    existing_client = db.query(DbUser).filter(DbUser.username == client_name).first()
    
    if not existing_client:
        client = DbUser(
            username=client_name,
            email="john@example.com",
            password=Hash.bcrypt("password123"),
            fullname="John Doe",
            role=RoleEnum.client.value
        )
        db.add(client)
        db.commit()
        db.refresh(client)
        print(f"Created client: {client.username}")
    else:
        client = existing_client
        print(f"Client {client_name} already exists.")

    # 2. Create Sample Projects
    projects_data = [
        {
            "title": "E-Commerce Rebrand",
            "description": "Redesigning the entire look and feel of the main shopping portal.",
            "status": ProjectStatus.in_progress.value
        },
        {
            "title": "Next.js Portfolio Site",
            "description": "Building a high-performance portfolio using Nuxt 4 and FastAPI.",
            "status": ProjectStatus.completed.value
        },
        {
            "title": "Mobile App UI",
            "description": "Drafting initial mockups for the new fitness tracking application.",
            "status": ProjectStatus.pending.value
        }
    ]

    for p_data in projects_data:
        existing_p = db.query(DbProject).filter(DbProject.title == p_data["title"]).first()
        if not existing_p:
            project = DbProject(
                title=p_data["title"],
                description=p_data["description"],
                status=p_data["status"],
                client_id=client.id
            )
            db.add(project)
            db.commit()
            db.refresh(project)
            print(f"Created project: {project.title}")
            
            # 3. Create Sample Communications for each project
            comm = DbCommunication(
                message=f"Starting work on {project.title}. Looking forward to it!",
                sender_id=client.id,
                project_id=project.id
            )
            db.add(comm)
            
            # 4. Create Sample Invoices
            invoice = DbInvoice(
                amount=500,
                status="paid" if project.status == ProjectStatus.completed.value else "unpaid",
                due_date=datetime.now() + timedelta(days=14),
                project_id=project.id
            )
            db.add(invoice)
            db.commit()
    
    print("Database seeding complete!")
    db.close()

if __name__ == "__main__":
    seed_db()
