# GCP Cloud Run CI/CD & Containerization Plan

To transition your platform into a fully containerized architecture that automatically drops into GCP Cloud Run without costing idle money, we will implement Docker, Docker Compose, and a GitHub Actions pipeline.

## Architectural Discovery: The SQLite Problem
> [!WARNING]
> Your FastAPI backend currently uses a local SQLite database (`fastapi_instagram.db`). **Cloud Run containers are ephemeral.** This means every time your serverless instance spins down to zero (saving you money), all local database files are completely deleted. 

**Decision:** Transitioned to an external database (Neon PostgreSQL for production) so data persists beyond the container's lifespan. The backend has been refactored to support a singular `DATABASE_URL` that works for both local PostgreSQL and Cloud Neon instances.

---

## Final Implementation Details

### 1. Unified Database Loading logic
- **`backend/src/db/database.py`**: Updated with intelligent scheme detection. If the `DATABASE_URL` starts with `sqlite`, it automatically applies the `check_same_thread: False` and `foreign_keys` pragmas required for local file testing. If it detects `postgresql`, it uses standard SQL drivers for Neon/Local Postgres instances.
- **Dependency Update**: Installed `psycopg2-binary` and `python-dotenv` via `uv` to support enterprise-grade database connections.

### 2. Secure Environment Configuration
- **`.env`**: Configured with the user's specific local PostgreSQL connection: `postgresql://postgres:admin@localhost:5432/postgres`.
- **`.env.example`**: Provided as a template for other developers to set up their local or production environment variables.

### 3. Containerization (Docker)
- **`backend.Dockerfile`**: Optimized Python 3.12-slim image using `uv` for ultra-fast dependency installation.
- **`frontend.Dockerfile`**: Multi-stage Node 20 build producing a minimal production-ready Nuxt SSR runner.
- **`docker-compose.yml`**: Full-stack orchestrator for local development, mounting source volumes for hot-reloading.

### 4. Dynamic GitHub Actions Pipeline
- **`.github/workflows/deploy.yml`**:
    - **Zero Hardcoding**: Modified to pull `GCP_PROJECT_ID`, `GCP_REGION`, and `GCP_ARTIFACT_REPO` from GitHub Secrets.
    - **Secret Injection**: The pipeline now injects `NEON_DATABASE_URL` and `APPLICATION_SECRET` directly into the Cloud Run environment on deployment, keeping production credentials completely out of the source code.

---

## Execution Walkthrough
The platform is now ready for production-grade scaling on GCP.
1. **Local Dev**: Run `docker-compose up` to boot the entire stack. It will connect to your local PostgreSQL instance instantly.
2. **Production**: Simply push to the `main` branch. GitHub Actions will build your images, push to Artifact Registry, and deploy to Cloud Run with your Neon database credentials secured.

### Post-Implementation Verification
- Successfully scaffolded the local PostgreSQL database using `Base.metadata.create_all(engine)`.
- Verified that all SQL drivers are properly loaded into the `pyproject.toml` environment.
