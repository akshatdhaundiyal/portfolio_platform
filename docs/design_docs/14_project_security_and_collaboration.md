# Milestone Documentation: Project Security & Collaborative Workspaces

This document provides a comprehensive overview of the architectural and functional enhancements implemented during the recent milestone. The focus was on establishing a robust Role-Based Access Control (RBAC) system, resolving routing inconsistencies, and introducing a versioned collaboration framework for project requirements.

---

## 🛡️ Role-Based Access Control (RBAC) & Security

To prepare the platform for multi-tenancy (Admins and multiple Clients), we implemented a strict security layer across the project management domain.

### Access Policies
- **Administrators**: Retain full CRUD (Create, Read, Update, Delete) permissions across all projects and system entities.
- **Clients**: Permissions are strictly limited to projects where their `client_id` is explicitly assigned.
    - **Read Access**: Clients can only list and view details of their own projects.
    - **Update Access**: Restricted to specific "collaborative" fields.
    - **Delete Access**: Completely prohibited.

### Technical Implementation: Field-Level Hardening
We implemented a "Discarding Update" logic in the backend. When a client submits a project update, the system automatically strips or rejects modifications to sensitive fields:
- `title` / `name` (Locked)
- `status` (Locked to Admin only)
- `client_id` (Locked)
- `trello_url`, `github_url`, `wip_url` (Locked)

> [!IMPORTANT]
> This ensures that project scope and integrations remain managed by the developer (Admin), while still allowing clients to contribute to descriptions and criteria.

---

## 📜 Versioned Acceptance Criteria

A major requirement was the introduction of **Acceptance Criteria** with full historical tracking to prevent "scope creep" and maintain clear accountability.

### Versioning Architecture
- **Automatic Logging**: Every update to the `acceptance_criteria` field triggers the creation of a record in the `project_criteria_history` table.
- **Author Attribution**: Each historical snapshot records exactly who made the change (Admin or Client) and the timestamp.
- **Database Schema**:
    - `DbProject`: Added `acceptance_criteria` column.
    - `DbCriteriaHistory`: New table recording `project_id`, `content`, `created_by`, and `created_at`.

### Client Portal Integration
The [Project Detailed View] now features:
- A prominent **Acceptance Criteria** section showing the current project goals.
- An **Edit History** sidebar that displays a vertical timeline of every revision made to the requirements.

---

## 🛣️ Routing & Stability Fixes

We addressed a critical `404 Not Found` issue on the `/projects` endpoint caused by FastAPI's strict trailing slash matching.

### The Fix: Non-Strict Route Prefixing
- **Previous state**: `@router.get("/")` coupled with `prefix="/projects"` required a trailing slash (`/projects/`). Requests to `/projects` failed.
- **New state**: Updated decorators to `@router.get("")`. This change allows the router to handle requests without the trailing slash natively, ensuring that standard frontend calls work reliably.

---

## 🎨 Frontend: Live Workspace Development

The Client Experience was transformed from a static prototype into a functional, live-synced portal.

### Key Enhancements
- **Dynamic Data Binding**: Replaced all hardcoded "dummy" projects with live `useAsyncData` fetches.
- **Collaborative UI**:
    - Added a **Collaborate on Scope** modal for clients to update descriptions and criteria.
    - Implemented a **Premium Dashboard** aesthetic consistent with the Admin side, featuring HSL-curated gradients and glassmorphism.
- **Real-time Feedback**: Integrated `USkeleton` for loading states and `useToast` for successful/failed save notifications.

---

## 📋 Verification Summary

| Feature | Test Case | Result |
| :--- | :--- | :--- |
| **RBAC** | Attempt to delete project as Client | `403 Forbidden` (Passed) |
| **Privacy** | Access Project B ID as Client A | `403 Forbidden` (Passed) |
| **Locking** | Attempt to change Title as Client | `403 Forbidden` (Passed) |
| **Versioning** | Update criteria as Client | History Log Created (Passed) |
| **Routing** | GET `/projects` (no slash) | `200 OK` (Passed) |

---

> [!TIP]
> **Next Steps**: Now that the core project management security is in place, the system is ready for **Alembic Database Migrations** to handle future schema changes without re-seeding the entire database.
