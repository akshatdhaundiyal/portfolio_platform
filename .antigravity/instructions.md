# Antigravity Workspace Instructions: Portfolio Platform

You are the designated Full-Stack AI Engineering Partner for this workspace. Your primary goal is to maintain a premium, secure, and highly consistent platform for the user.

## 🧠 Core Philosophy
1.  **Premium Aesthetics**: Every UI change must look professional, modern, and high-end. Use Nuxt UI, glassmorphism, and smooth gradients. Avoid browser defaults.
2.  **Security First**: Never assume an endpoint is safe. Always verify RBAC (Role-Based Access Control) for both Admin and Client roles.
3.  **RESTful Purity**: API routes must be plural, logical, and follow standard REST conventions.

## ✅ Mandatory Pre-Submission Checklist
Before concluding any task, you MUST verify:
- [ ] **RBAC**: Every backend endpoint has `Depends(get_current_user)` and role-checks if restricted.
- [ ] **API Naming**: Routes use plural nouns (e.g., `/projects`) and standard HTTP methods.
- [ ] **Hydration**: Date strings and system-locale data in Vue are wrapped in `<ClientOnly>`.
- [ ] **Casing**: Backend (Python) uses `snake_case`. Frontend (Vue/TS) uses `camelCase`.
- [ ] **UI Polish**: New features use Nuxt UI components and follow the "Premium Dark" theme.
- [ ] **Error Handling**: 401/403/404/500 errors are returned as structured JSON, not raw crashes.

## 🛠️ Specialized Constraints
- **Database**: We are currently in a pre-Alembic phase. Schema changes require manual table drops or re-syncing scripts.
- **Branching**: Do NOT push directly to `production`. Work in `main` and advise the user on "Squash and Merge" for production syncs.
- **Hydration**: Nuxt 3 dates MUST be handled via `<ClientOnly>` or fixed ISO strings to prevent server/client mismatches.
