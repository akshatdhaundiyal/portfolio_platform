# Milestone Documentation: CICD & Containerization

This document records the transition of the Portfolio Platform into a production-grade, containerized architecture ready for ephemeral cloud deployment on GCP Cloud Run.

---

## 🏗️ Architectural Overview

The primary challenge of this milestone was moving beyond "local machine" stability. We addressed the ephemeral nature of serverless containers by decoupling data from the application logic.

### Database Evolution
- **PostgreSQL Migration**: Transitioned from local SQLite to a unified PostgreSQL strategy (local PG for dev, Neon.tech for production).
- **Driver Abstraction**: Updated `database.py` with intelligent scheme detection to support both `postgresql` and `sqlite` URI schemas, ensuring cross-environment compatibility.
- **Dependency Hardening**: Integrated `psycopg2-binary` and `uv`-optimized dependency locking for reliable container builds.

### Containerization Strategy (Docker)
- **Backend Optimization**: Built a specialized `backend.Dockerfile` using Python 3.12-slim and `uv` for minimal image size and ultra-fast installation.
- **Frontend Multi-Stage Build**: Created a `frontend.Dockerfile` that compiles the Nuxt SSR application into a lightweight Node 20 production runner.
- **Orchestration**: Established a `docker-compose.yml` to allow for single-command full-stack boots with local volume mounting for hot-reloading.

### Automation (GitHub Actions)
- **Zero-Trust Deployment**: Authored a `.github/workflows/deploy.yml` pipeline that relies entirely on GitHub Secrets (`GCP_PROJECT_ID`, `NEON_DATABASE_URL`), ensuring no production credentials reside in the repository.

---

## 🧪 Walkthrough & Functional Flow

### 1. Local Development Containerization
- **Experience**: The developer runs `docker-compose up`.
- **Flow**: Docker boots the frontend and backend containers simultaneously -> Backend automatically detects the local PostgreSQL container and initializes the schema -> Frontend hot-reloading is preserved through volume mounts.

### 2. The Cloud Deployment Pipeline
- **Experience**: A "Commit & Push" to the `main` branch.
- **Outcome**: GitHub Actions triggers an automated build -> Images are pushed to GCP Artifact Registry -> Cloud Run instances are updated with the latest build, pointing securely to the Neon database.

---

## 📋 Verification Summary

| Feature | Test Case | Result |
| :--- | :--- | :--- |
| **Container Build** | Execute local `docker build` on both images | Success (Passed) |
| **Stack Orchestration** | Boot full stack via `docker-compose up` | Services Linked (Passed) |
| **DB Resilience** | Restart PG container and verify data persists | Persistent (Passed) |
| **CI/CD Logic** | Verify GitHub Secrets injection in YAML logs | Secured (Passed) |

---

> [!TIP]
> **Next Steps**: With the infrastructure containerized, we focus on **Authentication Modernization** to introduce persistent JWT security and session management.
