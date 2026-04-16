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
- **Modular Service Context**: Relocated `Dockerfile`s into their respective `/backend` and `/frontend` directories. This allows each service to be built from its own context, improving modularity and build reliability.
- **Backend Optimization**: Built using Python 3.12-slim and `uv`. The container root is optimized to run the localized `src` package, with an anonymous volume "shield" for `.venv` to prevent OS conflicts.
- **Frontend Multi-Stage Build**: Created a specialized Dockerfile with `development` (hot-reload) and `production` (slim node runner) targets. Includes an anonymous volume for `node_modules` to support cross-OS development.
- **Orchestration**: Updated `docker-compose.yml` to enable full stack hot-reloading with intelligent networking (SSR vs CSR resolution).


### Automation (GitHub Actions)
- **Zero-Trust Deployment**: Authored a `.github/workflows/deploy.yml` pipeline that relies entirely on GitHub Secrets (`GCP_PROJECT_ID`, `NEON_DATABASE_URL`), ensuring no production credentials reside in the repository.
- **Synchronized Build Contexts**: Re-engineered the CI/CD build steps to use modular contexts (`./backend` and `./frontend`). 
- **Production Targeting**: Implemented the `--target production` multi-stage build flag in the deployment pipeline to ensure only the slim, optimized runtime is pushed to GCP Cloud Run, excluding development tools.


---

## 🧪 Walkthrough & Functional Flow

### 1. Local Development Containerization
- **Experience**: The developer runs `docker-compose up`.
- **Flow**: Docker boots the frontend and backend containers simultaneously -> Backend automatically detects the local PostgreSQL container and initializes the schema -> **Hot-Reloading** is active for both services through shielded volumes, allowing instant UI and API updates.


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
