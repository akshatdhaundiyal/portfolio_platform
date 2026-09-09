---
title: Coding Standards
description: Mandatory coding standards for Backend, Frontend, Design System, and Database in the Portfolio Platform.
version: 2.0.0
---
# Coding Standards: Portfolio Platform

Adherence to these standards is mandatory for all contributions to this repository.

---

## 🎨 Design System & Frontend UI (Neo-Brutalist High-Contrast)
- **Design Tokens**: Use predefined CSS classes in `app/assets/css/design-system.css` (`.brutal-card`, `.brutal-btn`, `.brutal-shadow`, `.brutal-badge`, `.ticker-track`, `.perspective-1000`).
- **Color Consistency**:
  - Yellow: `#FFD027`
  - Blue: `#2B4CFF`
  - Red: `#FF334B`
  - Green: `#00D26A`
  - Pitch Black: `#000000`
  - Light Canvas: `#FDFBF7`
  - Dark Canvas: `#121316`
- **Typography Standards**:
  - Headers: `.font-display` (`Oswald`)
  - Subtitles / Buttons: `.font-heading` (`Space Grotesk`)
  - Body: `Plus Jakarta Sans`
  - Monospace / Stats: `.font-code` (`Space Mono`)
- **Interactive Micro-Interactions**:
  - Buttons and cards must use tactile displacement (`translate(-2px, -2px)` on hover, `translate(2px, 2px)` on active click).
  - Tickers must pause on hover for accessibility (`:hover .ticker-track { animation-play-state: paused; }`).

---

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

---

## 🟢 Frontend (Vue 3 / Nuxt 3)
- **Variable Naming**: All variable names and props must use `camelCase`.
- **Components**: Reusable components reside in `app/components/ui/` or `app/components/client/`.
- **Data Fetching**:
  - Use `useAsyncData` or `useFetch`.
  - Always include the `Authorization` header with the `auth_token` cookie for authenticated requests.
- **SSR & Hydration**:
  - Wrap any locale-specific or system-dependent rendering (like `toLocaleDateString()`) in `<ClientOnly>`.
  - Use `<USkeleton>` during `pending` states.

---

## 💾 Database
- **Schema Management**: Post-Alembic setup, all changes must be via migration files. Prior to that, provide explicit scripts to drop/recreate tables if columns are added/modified.
- **Relationships**: Always define `relationship()` on both sides of a foreign key for easy ORM navigation.

---

## 📚 Documentation & Milestone Standards
- **Technical Knowledge Base**: Every bug fix and technical hurdle MUST be documented in `docs/knowledge_base/`.
- **Milestone Logging**: Record major features in `docs/design_docs/00_milestone_summary.md`.
- **Audit**: Before marking a task as complete, verify that all rules and standards are adhered to.
