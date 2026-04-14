from typing import List
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.src.db.database import Base
import enum
import datetime

class RoleEnum(str, enum.Enum):
    admin = "admin"
    client = "client"

class ProjectStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    review = "review"
    completed = "completed"

class DbUser(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    fullname = Column(String, default=None)
    bio = Column(String, default=None)
    role = Column(String, default=RoleEnum.client.value)  # admin or client
    registration_date = Column(DateTime, server_default=func.now())
    last_login = Column(DateTime, server_default=func.now())
    
    projects = relationship("DbProject", back_populates="client")
    communications = relationship("DbCommunication", back_populates="sender")

class DbProject(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String, default=ProjectStatus.pending.value)
    client_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # New Integration Fields
    trello_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    github_token = Column(String, nullable=True)
    wip_url = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    client = relationship("DbUser", back_populates="projects")
    communications = relationship("DbCommunication", back_populates="project")
    invoices = relationship("DbInvoice", back_populates="project")
    files = relationship("DbProjectFile", back_populates="project")

class DbCommunication(Base):
    __tablename__ = "communications"
    
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    sender = relationship("DbUser", back_populates="communications")
    project = relationship("DbProject", back_populates="communications")

class DbInvoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer, nullable=False)
    status = Column(String, default="unpaid") # paid, unpaid, overdue
    due_date = Column(DateTime, nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    project = relationship("DbProject", back_populates="invoices")

class DbProjectFile(Base):
    __tablename__ = "project_files"
    
    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    uploaded_at = Column(DateTime, server_default=func.now())
    
    project = relationship("DbProject", back_populates="files")