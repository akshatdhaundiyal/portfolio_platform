# Background & Backend Development Knowledge

This document captures the technical evolution and "hard lessons" learned while building the FastAPI backend for the Portfolio Platform.

---

## 🛡️ 1. Role-Based Access Control (RBAC) Architecture

### The Problem
Initial implementations lacked clear separation between Admin and Client operations, leading to potential data leakage.

### The Knowledge
- **Access Policies**: 
    - Admins have full lifecycle control over all entities.
    - Clients are restricted by `client_id` and can only perform `READ` and limited `UPDATE` operations.
- **Implementation (Field-Level Hardening)**: 
    - When a Client updates a project, the backend must "sanitize" the incoming data by ignoring changes to sensitive fields like `title`, `status`, and integration URLs (`github_url`, etc.).
    - Use the concept of "Discarding Update" logic: compare the incoming schema with the existing DB state and only allow mutations on specific collaborative fields (e.g., `description`, `acceptance_criteria`).

---

## 🔑 2. Authentication & Security Modernization

### The Knowledge
- **Hashing Standard**: Migrated from `passlib` (unmaintained) to `pwdlib[argon2]`. Argon2 is the current industry standard for password hashing, offering superior resistance to GPU-based brute-force attacks.
- **JWT Storage**: Transitioned from standard header-based tokens to secure cookie-based storage for better frontend-backend synergy in Nuxt 3.
- **Identity Lookup**: Refactored the authentication router to support **dual-lookup** (Email or Username). This accommodates varying user preferences during the login flow.

---

## 🐍 3. Module Resolution & Absolute Imports

### The Problem
The project suffered from frequent `ModuleNotFoundError` because of the nested `backend/src/` structure.

### The Knowledge
- **Standardization**: Enforce absolute imports starting from the root-level package (e.g., `backend.src.routers.projects`).
- **Path Awareness**: In Docker environments, ensure the `PYTHONPATH` is explicitly set or the working directory is configured such that the `backend` package is discoverable.
- **Trailing Slashes**: FastAPI is strict about trailing slashes in route prefixes. Using `@router.get("")` with a `prefix="/projects"` is more resilient than `@router.get("/")` as it handles both `/projects` and `/projects/` depending on the caller.

---

## 🩺 4. Debugging Serverless 500 Errors

### The Problem
Generic 500 errors in Cloud Run were invisible to the frontend due to CORS policies blocking the body of failed requests.

### The Knowledge
- **Verbose Error Handler**: In development/staging, use a global exception handler that serializes the full Python `traceback` into JSON.
- **CORS Inclusivity**: The error response itself MUST include `Access-Control-Allow-Origin` and `Access-Control-Allow-Credentials` headers. Without these, the browser will refuse to show the traceback to the developer in the Network tab, even if the API returned it.

---

## 📦 5. Schema Discovery & Auto-Initialization

### The Knowledge
- **Auto-Genesis**: Use `models.Base.metadata.create_all(engine)` at the bottom of `main.py` rather than at the top. 
- **The "Why"**: Placing it at the end ensures that all routers and models have been imported and registered with the SQLAlchemy `Base` class. If called too early, SQLAlchemy will only create a subset of the tables, leading to "Table not found" errors during runtime.

---

## 👥 6. Specialized Role-Based Filtering

### The Knowledge
- **Efficiency**: Instead of fetching all users and filtering in the frontend, implement specialized server-side methods (e.g., `get_all_clients`) to reduce payload size and enforcement overhead.
- **RBAC Enforcement**: Use explicit role checks (`current_user.role != "admin"`) for admin-only management endpoints. Even if the data is filtered by role, the caller's authorization must be verified first to prevent horizontal privilege escalation.
 
 ---
 
 ## 💰 7. Financial Data Isolation & Relational Filtering
 
 ### The Knowledge
 - **Inverse Relational Filtering**: To fetch client-specific invoices, the backend should not rely on an `invoice.client_id` field (which can be redundant). Instead, use a **Join Filter** through the `Project` table.
     - **Mechanism**: `db.query(DbInvoice).join(DbProject).filter(DbProject.client_id == current_user.id)`. 
     - **Benefit**: This ensures that even if an invoice table was compromised, a client can ONLY see records programmatically linked to their verified projects.
 - **Professional Numbering**: Implement a standard numbering scheme (e.g., `INV-XXXX-YYMM`) within the `create_invoice` logic to ensure financial persistence and unique index lookup efficiency.
 - **Role-Based Mutation**: Ensure that any `PATCH` or `DELETE` on financial records is strictly gated by a hard `admin` role check. Clients should NEVER have write-access to their own billables.
