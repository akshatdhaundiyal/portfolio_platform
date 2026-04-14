# Coding Standards: Portfolio Platform

Adherence to these standards is mandatory for all contributions to this repository.

## 🐍 Backend (Python / FastAPI)
- **Variable Naming**: Use `snake_case` for all variables, functions, and file names.
- **REST Paths**: Always use plural nouns for collections (e.g., `/projects`, `/users`, `/invoices`).
- **Logic Layers**:
    - `models.py`: SQLAlchemy database models.
    - `schemas/`: Pydantic models for validation and display.
    - `db/db_{resource}.py`: CRUD implementation logic.
    - `routers/`: FastAPI route definitions.
- **Security**: 
    - Always use `get_current_user` dependency for authenticated routes.
    - Explicitly check `current_user.role` against `RoleEnum` values.

## 🟢 Frontend (Vue 3 / Nuxt 3)
- **Variable Naming**: Use `camelCase` for all variables, props, and functions.
- **Components**: Prefer Nuxt UI (`UButton`, `UCard`, `UInput`, etc.) to ensure aesthetic consistency.
- **Data Fetching**:
    - Use `useAsyncData` or `useFetch`.
    - Always include the `Authorization` header with the `auth_token` cookie.
    - Use a `fetchSafe` wrapper or try/catch blocks to handle common API errors (401, 403, 500) without breaking the UI.
- **SSR & Hydration**:
    - Wrap any locale-specific or system-dependent rendering (like `toLocaleDateString()`) in `<ClientOnly>`.
    - Use `<USkeleton>` during `pending` states.

## 💾 Database
- **Schema Management**: Post-Alembic setup, all changes must be via migration files. Prior to that, provide explicit scripts to drop/recreate tables if columns are added/modified.
- **Relationships**: Always define `relationship()` on both sides of a foreign key for easy ORM navigation.
