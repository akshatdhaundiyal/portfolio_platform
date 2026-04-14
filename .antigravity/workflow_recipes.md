# Development Workflow Recipes

Use these step-by-step guides to maintain project integrity during common development tasks.

## 🥯 Recipe: Adding a New Backend Resource
1.  **Define Model**: Add the SQLAlchemy class to `backend/src/db/models.py`.
2.  **Define Schemas**: Create the Pydantic models (Base, Create, Display) in `backend/src/schemas/`.
3.  **DB Utility**: Create the CRUD functions (create, get, update, delete) in `backend/src/db/db_{resource}.py`.
4.  **Router**: Implement the endpoints in `backend/src/routers/{resource}.py`.
    - Apply `get_current_user` dependency.
    - Implement RBAC checks.
    - Ensure paths are **plural** (e.g., `/items` not `/item`).
5.  **Include Router**: Add `app.include_router()` to `backend/src/main.py`.

## 🎨 Recipe: Implementing a New UI Feature
1.  **Page/Component**: Create the `.vue` file in `pages/` or `components/`.
2.  **Mock (Optional)**: Build the UI structure with mock data first to verify design.
3.  **Integration**:
    - Use `useAsyncData` for server-side-initialized data.
    - Set up the headers with the `auth_token` cookie.
    - Replace mock data with API results.
4.  **Hydration Check**: Ensure any locale-sensitive text (dates, currency) is wrapped in `<ClientOnly>`.
5.  **Aesthetic Polish**: Apply glassmorphism or gradients to match the "Premium Dark" theme.

## 🚀 Recipe: Fast-Forward Release Workflow
1.  **Sync Main**: Ensure your local `main` matches the remote: `git pull origin main`.
2.  **GitHub PR**:
    - Create a Pull Request on GitHub from `main` → `production`.
    - Click **"Rebase and merge"** (ensure "Squash" is disabled in settings).
3.  **Local Fast-Forward**:
    - Switch to production: `git checkout production`.
    - Sync without divergence: `git fetch origin && git merge origin/production --ff-only`.
    - Switch back to development: `git checkout main`.
4.  **Versioning**: Update the milestone documentation in `docs/design_docs/`.
