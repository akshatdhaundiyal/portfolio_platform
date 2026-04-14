# Milestone 11: Frontend-Backend Integration & Seeding

## Overview
This milestone marks the transition from a static, mocked prototype to a functional full-stack application. We have established a real-time connection between the Nuxt 4 frontend and the FastAPI backend, and populated the platform with realistic mock data for local testing.

---

## 1. Database Schema Expansion
To support the "Freelance Platform" features, we expanded the core database models:
- **`DbInvoice`**: Added an invoices table to track payments, amounts, and statuses (Paid/Unpaid/Overdue).
- **`DbProjectFile`**: Added support for tracking deliverables and work-in-progress files per project.
- **Relationships**: Updated the `DbProject` model to include relationships for these new tables, allowing for deep-nested data fetching.

## 2. API Connectivity & CORS
- **Middleware**: Enabled `CORSMiddleware` in `backend/src/main.py`. This allows the frontend (operating on port 3000) to safely talk to the backend (on port 8000).
- **Credentials**: Configured CORS to `allow_credentials=True`, which is mandatory for the browser to share JWT-based cookies across domains.
- **Runtime Configuration**: Updated `frontend/nuxt.config.ts` with `runtimeConfig.public.apiBase`. This ensures that the frontend can dynamically find the API URL in both local and production environments.

## 3. Real Authentication (Cookies)
- **OAuth2 Integration**: Refactored `login.vue` to use the real `/token` endpoint. 
- **Session Management**: Replaced mock logic with `useCookie('auth_token')`. This stores the JWT securely in the browser, allowing the user to remain logged in across page refreshes.
- **Error Feedback**: Integrated a `UAlert` system into the login card to provide user feedback for invalid credentials or connection issues.

## 4. Seeding & Mock Data
- **`seed.py`**: Created a high-fidelity seeding utility (`backend/src/db/seed.py`).
- **Data Set**: Populated the database with:
    - 1 Test Client (`john_client` / `password123`).
    - 3 Unique Projects with varying statuses (In-Progress, Completed, Pending).
    - Sample communications and invoices for each project.

## 5. Admin Project CRUD
The Admin Dashboard was transitioned from a placeholder to a functional management hub:
- **Project Life-cycle**: Implemented a state-managed form for creating, editing, and deleting projects.
- **Workflow Orchestration**: Added support for updating project statuses (`pending`, `in_progress`, `review`, `completed`) with real-time feedback.
- **Client Selection**: Linked the project creation flow to a dynamic list of users filtered by the `client` role.

---

## 🛠️ Troubleshooting & Refinements

During local integration, we resolved several critical connectivity "gotchas":

### 1. Local SSL Enforcement (OperationalError)
- **Issue**: The backend was forcing `sslmode=require` for all PostgreSQL connections, which caused local servers (localhost) to crash since they don't typically support SSL.
- **Fix**: Updated `database.py` to only enforce SSL for remote hosts (e.g., Neon), while allowing non-SSL connections for `localhost` and `127.0.0.1`.

### 2. CORS Hostname Mismatches
- **Issue**: Browsers treat `localhost:3000` and `127.0.0.1:3000` as different origins. Using one for the URL and another for the origin caused preflight failures.
- **Fix**: Expanded the `origins` list in `main.py` to explicitly include both hostnames, ensuring consistent local access.

### 3. Nuxt Fetching Architecture (`$fetch` vs `useFetch`)
- **Issue**: Using `useFetch` inside an event handler (like a button click) caused a "Component already mounted" warning and potential hydration issues.
- **Fix**: Migrated the login handler to use **`$fetch`**. While `useFetch` is optimized for page-load data fetching (SSR), `$fetch` is the correct tool for user-triggered interaction.

### 4. Connection Refused Handling
- **Issue**: Attempting to connect when the backend was down resulted in `ERR_CONNECTION_REFUSED`.
- **Refinement**: Added robust error handling and console logging to the frontend to surface backend downtime directly to the developer and user.

### 5. JWT Integrity & Stale Cookies
- **Issue**: Received a `Couldnt validate due to JWT decode error` even when the secret keys matched. 
- **Cause**: Browsers retain cookies based on domain/port regardless of backend state changes. If the `SECRET_KEY` or JWT algorithm is altered in development, existing client-side cookies become invalid and toxic to subsequent requests.
- **Fix**: Implemented backend logging for `jwt.JWTError` to surface these issues in the terminal and established a "Cookie Clearance" protocol for development synchronization.

### 6. Nuxt 4 IPC Stability (Dev Server Crashes)
- **Issue**: The Nuxt dev server would frequently disconnect with `IPC connection closed` or `RELOAD` loops on Windows.
- **Cause**: Nuxt 4's Vite worker expects clean TypeScript boundaries. Using TS features (like `: any`) within `<script setup>` without the explicit `lang="ts"` attribute caused silent compilation failures that crashed the IPC bridge.
- **Fix**: Hardened all project `.vue` files with `lang="ts"`. Added `@types/node` and updated `tsconfig.json` to improve the stability of the development environment.

### 7. Environment Parity Diagnostics
- **Issue**: Ambiguity between local database state and API response values during troubleshooting.
- **Solution**: Developed a standalone diagnostic script (`scratch/check_db.py`) that uses the same `Settings` class as the main application. This allows developers to verify DB content independently of the API layer, effectively isolating data-presence issues from serialization/auth issues.

---
## Final Verification (Local)
1. **Seeding**: Successfully ran `python -m backend.src.db.seed`.
2. **CORS**: Verified that the backend allows requests from both `localhost` and `127.0.0.1`.
3. **Login**: The frontend retrieves a real JWT via `$fetch` and stores it in cookies.
4. **CRUD Integrity**: Verified that projects can be created, edited (status/title/desc), and deleted with immediate database persistence and UI reactivity.
5. **Stability**: Confirmed zero IPC crashes during a 30-minute stress test of the development environment.

The bridge is now built, hardened, and documented for scale! 🌉🚀
