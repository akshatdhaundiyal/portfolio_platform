# System Architecture: High-Level Overview

This document provides a concise map of the Portfolio Platform's architecture for quick onboarding. For detailed historical records and "lessons learned," refer to the [Design Docs](../design_docs/) and [Knowledge Base](../knowledge_base/).

## 🏗️ Deployment Topology

The system is a containerized 3-tier application:

1.  **Frontend (Nuxt.js)**: SSR-enabled Vue application.
2.  **Backend (FastAPI)**: RESTful API with PostgreSQL/SQLAlchemy.
3.  **Database (PostgreSQL)**: Persistent storage orchestrator.

## 📂 Modular Service Logic

Each service is decoupled. To maintain this, we follow these rules:
- **Service Isolation**: All configuration (`Dockerfile`, `pyproject.toml`) lives inside the service folder (`/backend`, `/frontend`).
- **Localized Paths**: The backend uses `src.` as its root. We never use absolute `backend.` prefixes in the code.

## ⚡ Developer Velocity (Hot-Reload)

We use **Docker Mirroring** for instant feedback:
- **Code Sync**: Local folders are mounted directly into containers.
- **Dependency Shielding**: We use anonymous Docker volumes to prevent your host machine (Windows/Mac) from corrupting the container's environment.

## 🔌 API & CI/CD Resolution Map

### Networking
| Request Type | Target URL | Context |
| :--- | :--- | :--- |
| **Client-Side (Browser)** | `localhost:8000` | Fetching data from your laptop. |
| **Server-Side (Nuxt SSR)** | `backend:8080` | Internal container-to-container calls. |

### CI/CD Deployment
The [deploy.yml](../.github/workflows/deploy.yml) is synchronized to use the modular build contexts:
- **Backend Build**: Context `./backend`, uses `backend/Dockerfile`.
- **Frontend Build**: Context `./frontend`, uses `frontend/Dockerfile` with `--target production` to ensure a slim runtime.


---
**References:**
- Detailed Docker Logic: [Milestone 07](../design_docs/07_cicd_and_containerization.md)
- Networking Strategy: [Milestone 11](../design_docs/11_frontend_backend_integration.md)
- Development Best Practices: [Knowledge Base](../knowledge_base/README.md)
