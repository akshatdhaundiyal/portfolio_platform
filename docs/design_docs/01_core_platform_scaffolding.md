# Freelance Portfolio Platform Implementation Plan

This document outlines the strategy for building the freelance portfolio platform. We will transition the existing FastAPI setup into the new backend architecture and scaffold a new Nuxt 3 app for the frontend.

## User Review Required

> [!IMPORTANT]
> - Are you okay with dropping/modifying the existing Instagram-like "Article" models in the backend, or should I keep them alongside the new portfolio models? 
> - For the frontend, do you prefer an all-in-one Nuxt application handling both the Main site, Client Portal, and Admin Panel via routing, or separated apps? The plan currently assumes a single unified Nuxt app with role-based routing (`/client/...` and `/admin/...`).

## Proposed Changes

### Backend (FastAPI)

We will modify the existing backend structure located in `/backend` to accommodate the new business logic.

#### [MODIFY] backend/src/db/models.py
- Refactor `User` model to introduce internal roles (e.g., `is_admin`, `is_client`).
- Create a `Project` model storing project details, statuses (like `Quote`, `WIP`, `Completed`), and linking with a specific client (`User`).
- Create a `Communication` model storing message threads related to a `Project`.

#### [NEW] backend/src/routers/projects.py
- Define endpoints for Admin to assign projects and Clients to fetch their WIP / final projects.

#### [NEW] backend/src/routers/communications.py
- Define endpoints to fetch and post messages for specific projects.

#### [MODIFY] backend/src/main.py
- Register new routers.
- Add necessary authentication middleware to restrict Client vs. Admin routes appropriately.

---

### Frontend (Nuxt 3 + Nuxt UI)

We will initialize a new frontend application within the `frontend` folder.

#### [NEW] `npx nuxi@latest init frontend`
- Initialize the Nuxt 3 application.
- Install `@nuxt/ui` (which includes Tailwind CSS under the hood) for our styling and component needs.

#### [NEW] frontend/pages/login.vue
- Login portal handling JWT authentication connecting to our FastAPI backend.

#### [NEW] frontend/pages/client/
- `index.vue`: Dashboard showing a list of assigned projects and WIP status.
- `[projectId].vue`: Detailed view of a project containing its specs, files, and the communication thread messages.

#### [NEW] frontend/pages/admin/
- Dashboard for managing user accounts (clients) and adding/updating projects.

## Open Questions

> [!WARNING]
> - Are there any specific details or file management requirements (like uploading project files, images, PDFs) that need to be supported in the initial version? I noticed an `/images` route existing in the backend already.

## Verification Plan

### Automated Tests
- Scaffold simple `pytest` endpoints testing to verify the backend API is working (specifically testing role barriers: Client accessing Admin data must fail).

### Manual Verification
- We will boot up both the FastAPI backend (`uvicorn`) and Nuxt 3 frontend server (`npm run dev`).
- We will visually inspect the UI to ensure the design feels premium, modern, and implements `@nuxt/ui` elements correctly.
- Perform an end-to-end user path: Create Admin -> Add Client -> Add Project -> Login as Client -> Verify Project details & WIP are visible.

---

# Freelance Portfolio Platform - Walkthrough

The initial scaffolding for both your Nuxt 4 frontend and FastAPI backend is completed!

## What was Changed?

### 1. Database and Models (Backend)
- Redesigned the FastAPI structural models inside `backend/src/db/models.py`. The backend now contains an interconnected logic of **Users**, **Projects**, and **Communications**.
- Set up endpoints (`projects.py` and `communications.py`) to serve proper access between Admin roles and Client roles.
- Purged previous legacy code revolving around the Instagram clone ('Articles').

### 2. Frontend Structure (Nuxt 4)
- Created the foundation of your Nuxt 4 Frontend inside `/frontend`.
- Built the `login` view with dummy logic directing to the appropriate dashboards.
- Implemented **Nuxt UI** heavily to bring modern visual excellence to your application using UCards, UTabs, and UBadges.
- Admin Panel: Found at `/admin`, allowing you to see managed projects and manage clients.
- Client Portal: Found at `/client`, giving clients a dynamic look into their active projects, providing a WIP insight and chat-box communication style feature at `/client/[projectid]`.

## Verification Steps
To see the platform live, you will need to start up both the APIs and the UI.
1. Run `npm install` inside `/frontend` then run `npm run dev`.
2. Start your backend FastAPI instance from the root project folder.
3. Observe the polished UI and layout implemented.

> [!TIP]
> The database has been reset and models have been altered. It is advised you spin up the server fresh to ensure FastAPI executes `models.Base.metadata.create_all(engine)` smoothly into the `fastapi_instagram.db` SQLite file.
