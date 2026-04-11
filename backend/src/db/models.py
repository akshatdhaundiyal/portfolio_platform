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
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    client = relationship("DbUser", back_populates="projects")
    communications = relationship("DbCommunication", back_populates="project")

class DbCommunication(Base):
    __tablename__ = "communications"
    
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    sender = relationship("DbUser", back_populates="communications")
    project = relationship("DbProject", back_populates="communications")