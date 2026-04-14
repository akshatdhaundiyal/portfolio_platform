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
    
    # 0. Create Admin User (Needed for Dashboard access)
    admin_name = "admin"
    existing_admin = db.query(DbUser).filter(DbUser.username == admin_name).first()
    if not existing_admin:
        admin = DbUser(
            username=admin_name,
            email="admin@example.com",
            password=Hash.bcrypt("admin12321"),
            fullname="Primary Admin",
            role=RoleEnum.admin.value
        )
        db.add(admin)
        db.commit()
        print("Created admin user.")
    
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
            "description": "Complete overhaul of the existing e-commerce platform with a focus on mobile responsive design and improved checkout conversion.",
            "status": ProjectStatus.in_progress.value,
            "trello_url": "https://trello.com/b/8nZ3x2z1/ecommerce-rebrand",
            "github_url": "https://github.com/akshatdhaundiyal/portfolio_platform",
            "wip_url": "https://ecommerce-preview.example.com",
            "start_date": datetime.now() - timedelta(days=15)
        },
        {
            "title": "Next.js Portfolio Site",
            "description": "A minimalist portfolio site using Next.js 14 and Sanity CMS for high performance and easy content management.",
            "status": ProjectStatus.completed.value,
            "trello_url": "https://trello.com/b/9mK2y7x5/portfolio-site",
            "github_url": "https://github.com/akshatdhaundiyal/portfolio_platform",
            "wip_url": "https://portfolio-live.example.com",
            "start_date": datetime.now() - timedelta(days=45)
        },
        {
            "title": "Mobile App UI",
            "description": "Designing a clean, intuitive UI for a new fitness tracking mobile application.",
            "status": ProjectStatus.pending.value,
            "trello_url": "https://trello.com/b/4jL1v9p0/fitness-app-ui",
            "github_url": "https://github.com/akshatdhaundiyal/portfolio_platform",
            "wip_url": None,
            "start_date": datetime.now() - timedelta(days=2)
        }
    ]

    for p_data in projects_data:
        existing_p = db.query(DbProject).filter(DbProject.title == p_data["title"]).first()
        if not existing_p:
            project = DbProject(
                title=p_data["title"],
                description=p_data["description"],
                status=p_data["status"],
                client_id=client.id,
                trello_url=p_data.get("trello_url"),
                github_url=p_data.get("github_url"),
                wip_url=p_data.get("wip_url"),
                start_date=p_data.get("start_date")
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
            invoice_num = f"INV-{project.id:04d}-{datetime.now().strftime('%y%m')}"
            invoice = DbInvoice(
                invoice_number=invoice_num,
                amount=500,
                description=f"Initial deposit for {project.title}",
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
