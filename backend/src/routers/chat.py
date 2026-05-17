from typing import List, Dict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.db import db_communication
from src.schemas.communication_schema import CommunicationCreate
from src.utils.auth_service.oauth2_util import SECRET_KEY, ALGORITHM
from jose import jwt
from src.db.models import DbUser
import json

router = APIRouter(prefix="/chat", tags=["chat"])

class ConnectionManager:
    def __init__(self):
        # Dictionary mapping project_id to a list of active WebSockets
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, project_id: int):
        await websocket.accept()
        if project_id not in self.active_connections:
            self.active_connections[project_id] = []
        self.active_connections[project_id].append(websocket)

    def disconnect(self, websocket: WebSocket, project_id: int):
        if project_id in self.active_connections:
            if websocket in self.active_connections[project_id]:
                self.active_connections[project_id].remove(websocket)
            if not self.active_connections[project_id]:
                del self.active_connections[project_id]

    async def broadcast(self, message: dict, project_id: int):
        if project_id in self.active_connections:
            for connection in self.active_connections[project_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Error broadcasting to a connection: {e}")

manager = ConnectionManager()

def get_user_from_token(token: str, db: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            return None
        user = db.query(DbUser).filter(DbUser.id == int(user_id)).first()
        return user
    except Exception as e:
        print(f"Chat Auth Error: {e}")
        return None

@router.websocket("/{project_id}")
async def websocket_endpoint(
    websocket: WebSocket, 
    project_id: int, 
    token: str = Query(...), 
    db: Session = Depends(get_db)
):
    user = get_user_from_token(token, db)
    if not user:
        print(f"WebSocket rejected: Invalid token for project {project_id}")
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, project_id)
    print(f"User {user.username} connected to project {project_id} chat")
    
    try:
        while True:
            # We expect a simple text message or a JSON string
            data = await websocket.receive_text()
            
            try:
                # If it's JSON, we might want to extract just the message
                msg_data = json.loads(data)
                message_text = msg_data.get("message", data)
            except json.JSONDecodeError:
                message_text = data

            if not message_text.strip():
                continue

            # Save to database for persistence
            comm_request = CommunicationCreate(message=message_text, project_id=project_id)
            db_comm = db_communication.create_communication(db, comm_request, sender_id=user.id)
            
            # Broadcast to all users in the project room
            await manager.broadcast({
                "id": db_comm.id,
                "message": db_comm.message,
                "sender_id": db_comm.sender_id,
                "sender_name": user.fullname or user.username,
                "created_at": db_comm.created_at.isoformat(),
                "project_id": project_id
            }, project_id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, project_id)
        print(f"User {user.username} disconnected from project {project_id} chat")
    except Exception as e:
        print(f"WebSocket error for user {user.username}: {e}")
        manager.disconnect(websocket, project_id)
