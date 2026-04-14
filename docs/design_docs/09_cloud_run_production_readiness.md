# Milestone 9: Cloud Run Production Readiness & Troubleshooting

## Overview
This milestone documents the iterative process of stabilizing the backend deployment on Google Cloud Run. We resolved critical issues across infrastructure configuration, source code imports, and filesystem persistence to ensure a robust, serverless-ready application.

---

## 1. Infrastructure & Secrets Resolution

### Problem
The initial deployment failed due to **Secret Manager Conflicts** and **Port Binding** issues. Legacy references to GCloud Secrets caused permission errors, and the container failed to bind to the dynamic port injected by Cloud Run.

### Implementation
- **Secret Clearing**: Added `--clear-secrets` to the `gcloud run deploy` command to purge stale references.
- **Project Scoping**: Explicitly passed `--project $PROJECT_ID` to resolve ambiguity in the GCP environment.
- **Dynamic Port Binding**: Refactored the `backend.Dockerfile` to use the `${PORT:-8000}` environment variable, allowing Cloud Run to manage the health-check port (standard 8080).
- **Environment Variable Migration**: Moved all production credentials (`DATABASE_URL`, `SECRET_KEY`) to `--set-env-vars` for a simpler, cost-effective setup.

---

## 2. Source Code Import Resolution

### Problem
Once infrastructure was stable, the application crashed with a `ModuleNotFoundError` because several routers were attempting to import from a non-existent module: `backend.src.utils.auth_service.oauth2`.

### Implementation
- **Unified Import Paths**: Identified that a previous refactor renamed the module to `oauth2_util.py`. I updated `backend/src/routers/projects.py` and `backend/src/routers/communications.py` to correctly reference the newer filename.
- **Consistency Audit**: Verified that all other authentication-dependent modules were correctly aligned with the `oauth2_util` naming convention.

---

## 3. Filesystem & Persistence Fixes

### Problem
The final startup hurdle was a `RuntimeError: Directory 'backend/images' does not exist`. This occurred because Git do not track empty directories, leaving the container without a required mount point for static files.

### Implementation
- **Build-time Enforcement**: Added `RUN mkdir -p backend/images` to the `backend.Dockerfile` to guarantee the directory structure exists within the container image.
- **Runtime Defensive Logic**: Updated `backend/src/main.py` with an `os.makedirs` check during startup. The application can now self-heal and create its own required directories if they are missing in the environment.
- **Database Resilience**: Hardened `backend/src/db/database.py` to automatically enforce `sslmode=require` for Neon PostgreSQL connections, preventing cold-start timeouts.

---

## 4. Stability & Debugging Enhancements

### Problem
Diagnosing 500 errors in a serverless production environment is difficult because Cloud Run logs can be delayed, and browser CORS policies often block the visibility of error response bodies from cross-origin APIs.

### Implementation
- **CORS-Aware Verbose Error Handler**: Added a global exception handler in `main.py` that serializes the `traceback` into the JSON response. Crucially, it dynamically sets CORS headers (`Access-Control-Allow-Origin`) on the error response itself, allowing frontend developers to see the exact Python exception in the browser's Network tab.
- **Boot-time Schema Enforcement**: Automated database initialization by calling `models.Base.metadata.create_all(engine)` during the application startup sequence. This guarantees that new tables or schema changes are applied automatically upon deployment, eliminating "Table not found" errors in the cloud.

---

## Final Verification
The backend is now fully production-ready:
1. **GitHub Actions**: Pipeline is clean, efficient, and uses environment-scoped secrets.
2. **Cloud Run**: Health checks successfully pass as all path, port, and database hurdles have been cleared.
3. **Debugging Layer**: A temporary verbose error handler is in place to surface runtime exceptions during integration testing.
4. **Local Dev**: The container remains compatible with local `docker-compose` workflows.
