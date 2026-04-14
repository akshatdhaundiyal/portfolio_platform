# Milestone Documentation: Cloud Run Production Readiness

This document records the iterative stabilization of the backend deployment on Google Cloud Run, focusing on infrastructure hardening and the resolution of serverless-specific environment hurdles.

---

## 🏗️ Architectural Overview

Deploying to a serverless, ephemeral environment like Cloud Run required significant adjustments to how the application handles port binding, filesystem tracking, and secrets management.

### Infrastructure Hardening
- **Dynamic Port Management**: Refactored the container to bind to the dynamic `$PORT` environment variable injected by GCP, ensuring compatibility with Cloud Run's internal health check system (defaulting to 8080).
- **Secret & Env Orchestration**: Migrated from GCloud Secrets to secured Environment Variables for high-traffic credentials (`DATABASE_URL`, `SECRET_KEY`), reducing latency and simplifying the deployment manifest.

### Application Stabilization
- **Filesystem Persistence**: Identified that Git does not track empty directories, leading to `ModuleNotFoundError` on missing mount points. Implemented `RUN mkdir -p` in the Dockerfile and defensive `os.makedirs` logic in the application startup to ensure self-healing directory creation.
- **Import Resolution**: Standardized the import paths for authentication utilities (`oauth2_util.py`) across the `projects` and `communications` routers to resolve runtime crashes.

---

## 🧪 Walkthrough & Functional Flow

### 1. The Cloud Deployment Experience
- **Location**: GitHub Actions -> GCP Cloud Run.
- **Experience**: Pushing code to `main` triggers an automated build.
- **Flow**: The container initializes -> Schema is automatically enforced via `metadata.create_all(engine)` -> SSL is enforced for the Neon database connection -> The system becomes available at the production URL.

### 2. Instrumented Debugging
- **Experience**: Encountering a runtime 500 error in the cloud.
- **Flow**: A global CORS-aware exception handler serializes the traceback -> Developer views the exact Python error in the browser Network tab, bypassing the opacity of serverless log delays.

---

## 📋 Verification Summary

| Feature | Test Case | Result |
| :--- | :--- | :--- |
| **Port Binding** | Deploy to Cloud Run and verify health check | Success (Passed) |
| **Directory Auto-Creation** | Purge `backend/images` and check startup logs | Self-Healed (Passed) |
| **DB SSL Enforcement** | Verify secure connection to Neon PostgreSQL | Encrypted (Passed) |
| **CORS Error Visibility** | Trigger a crash and inspect browser response | Traceback Visible (Passed) |

---

> [!TIP]
> **Next Steps**: With the cloud environment stable, we focus on **Git Workflow and Release Strategy** to manage safe transitions between development and production.
