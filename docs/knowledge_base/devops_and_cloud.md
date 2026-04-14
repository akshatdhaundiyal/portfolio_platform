# DevOps & Cloud Infrastructure Knowledge

This document captures the infrastructure logic and deployment hurdles of the Portfolio Platform.

---

## 🏗️ 1. Containerization with `uv`

### The Knowledge
- **Performance**: The project uses `uv` for Python package management within Docker. This reduced build times by ~85% compared to standard `pip`.
- **Layer Optimization**: Always copy `pyproject.toml` and `uv.lock` first to cache the virtual environment layer. Only copy the application source code in the final stages.

---

## 🚀 2. Google Cloud Run Connectivity

### The Problem
The first deployment attempts failed due to **Secret Manager Conflicts** and **Port Binding** errors.

### The Knowledge
- **Port Binding**: Cloud Run injects a dynamic `$PORT` environment variable. The `uvicorn` command in the `Dockerfile` must use `--port ${PORT:-8080}` to bind correctly, otherwise the health check will fail, causing a container rollback.
- **Secret Management**:
    - Use `--clear-secrets` during deployment if you previously shifted from manual env-vars to Secret Manager to avoid configuration collisions.
    - Standardize on `gcloud run deploy --region {region} --project {project_id}` to resolve ambiguity in the GCP environment.
- **SSL Hardening**: For Neon PostgreSQL connections, the `sslmode=require` parameter is mandatory to prevent connection timeouts during Cloud Run's cold-start phase.

---

## 📂 3. Filesystem Persistence & "Ghost" Directories

### The Problem
The backend crashed on startup because the `backend/images` directory (used for file uploads) was missing from the container image.

### The Knowledge
- **The Cause**: Git do not track empty directories.
- **The Global Fix**:
    - Add `RUN mkdir -p backend/images` to the `Dockerfile`.
    - Implement a "Self-Healing" check in `main.py` using `os.makedirs(path, exist_ok=True)` during the startup sequence.

---

## 🛡️ 4. CORS Visibility in Cloud Production

### The Problem
Frontend developers couldn't see why the cloud API was returning 500 errors because the browser's CORS check would fail before the response body was revealed.

### The Knowledge
- **The Fix**: The global exception handler must explicitly set `Access-Control-Allow-Origin` to the specific requester's origin (or a wildcard in restricted debug modes) *within the error response itself*.
- **Implementation**:
    ```python
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        origin = request.headers.get("origin")
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc), "traceback": traceback.format_exc()},
            headers={"Access-Control-Allow-Origin": origin if origin else "*"}
        )
    ```

---

## 🤖 5. CI/CD: GitHub Actions Security

### The Knowledge
- **Workload Identity Federation (WIF)**: The project uses WIF instead of long-lived Service Account keys. This is the current best practice for connecting GitHub Actions to GCP, as it uses ephemeral tokens.
- **Environment Scoping**: Use GitHub Environments (`production`, `staging`) to scope secrets like `DATABASE_URL` and `GCP_SA_EMAIL`.
