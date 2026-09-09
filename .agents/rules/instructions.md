---
title: Workspace Instructions
description: Core philosophy, design language rules, checklist, and specialized constraints.
version: 2.0.0
---
# Workspace Instructions: Portfolio Platform

You are the designated Full-Stack AI Engineering Partner for this workspace. Your primary goal is to maintain a premium, secure, high-contrast, and highly consistent platform for the user.

---

## 🎨 Design Language & Visual System (Neo-Brutalism & High Contrast)

The public-facing pages and shared interface adhere to a bold, physical, tactile **Neo-Brutalist / High-Contrast** design system:

### 1. Color Palette Tokens
- **Canvas Base**: Warm Off-White / Cream (`#FDFBF7` light mode, `#121316` dark mode)
- **Primary Accents**:
  - Cobalt Blue: `#2B4CFF` (or `#4D17F5`)
  - Canary Yellow: `#FFD027` / `#FFE600`
  - Crimson / Coral Red: `#FF334B`
  - Emerald Green: `#00D26A`
  - Deep Purple: `#7C3AED`
- **Structural Black**: Pitch Black (`#000000`) for all borders, shadows, and high-contrast badges.

### 2. Geometry, Borders & Hard Shadows
- **Borders**: Crisp, heavy solid black borders (`2.5px` to `3.5px solid #000000`).
- **Offset Box Shadows**: Hard-edge, zero-blur drop shadows:
  - Standard Shadow: `box-shadow: 4px 4px 0px #000000;`
  - Large Card Shadow: `box-shadow: 6px 6px 0px #000000;`
  - Modal / Banner Shadow: `box-shadow: 8px 8px 0px #000000;`
- **Tactile Click Micro-Interactions**:
  - Hover: `transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #000000;`
  - Active / Press: `transform: translate(2px, 2px); box-shadow: 2px 2px 0px #000000;`

### 3. Typography Hierarchy
- **Display / Major Headers**: `Oswald` (uppercase, heavy font-weight 700-900, tight line-height).
- **Subheadings & Buttons**: `Space Grotesk` (geometric, uppercase, tracking-wider).
- **Body Text**: `Plus Jakarta Sans` or `Inter` (high legibility, 400-600 weight).
- **Code & Metric Labels**: `Space Mono` or JetBrains Mono.

### 4. Interactive Micro-Interactions
- **Continuous Marquee Tickers**: Smooth infinite CSS marquee ribbons (`.ticker-track`) with high-contrast accent backgrounds.
- **3D Flip & Tilt Cards**: Perspective-1000 interactive 3D rotation (`.perspective-1000`, `.rotate-y-180`) on hover/click.
- **Badge Motifs**: Geometric pill and square tags with thick borders and hard shadows.

---

## 🧠 Core Philosophy
1.  **High-Impact Aesthetics**: Every UI change must be sharp, bold, and distinct. Never use generic low-contrast templates or default browser styling.
2.  **Form Follows Function**: High visual personality paired with rigorous engineering (clear data models, fast SSR, zero runtime warnings).
3.  **Security First**: Always verify RBAC (Role-Based Access Control) for both Admin and Client roles on the backend.
4.  **RESTful Purity**: API routes must be plural, logical, and follow standard REST conventions.

---

## ✅ Mandatory Pre-Submission Checklist
Before concluding any task, you MUST verify:
- [ ] **RBAC**: Every backend endpoint has `Depends(get_current_user)` and role-checks if restricted.
- [ ] **API Naming**: Routes use plural nouns (e.g., `/projects`) and standard HTTP methods.
- [ ] **Hydration**: Date strings and system-locale data in Vue are wrapped in `<ClientOnly>`.
- [ ] **Casing**: Backend (Python) uses `snake_case`. Frontend (Vue/TS) uses `camelCase`.
- [ ] **Design Language**: Public UI features follow the Neo-Brutalist high-contrast design system (`design-system.css`).
- [ ] **Error Handling**: 401/403/404/500 errors are returned as structured JSON, not raw crashes.
- [ ] **Documentation & Logging**: Updated `docs/knowledge_base` and design docs for major changes.

---

## 📚 Documentation & Milestone Standards
- **Technical Knowledge Base**: Every bug fix and technical hurdle MUST be documented in `docs/knowledge_base/`. Explain the "why" and constraints (e.g., CORS, hydration).
- **Milestone Documentation**: Every major feature or milestone MUST have:
    1.  An entry in the `00_milestone_summary.md`.
    2.  A dedicated design document in `docs/design_docs/`.
    3.  The design document MUST contain a **Walkthrough** section describing the functional flow and a **Verification** table with test results.
- **Audit**: Before finishing, verify that documentation is up to date.

---

## 🛠️ Specialized Constraints
- **Database**: Pre-Alembic phase; schema changes require manual table drops or re-syncing scripts.
- **Branching**: Work in `main` and advise the user on "Squash and Merge" for production syncs.
- **Hydration**: Nuxt 3 dates MUST be handled via `<ClientOnly>` or fixed ISO strings to prevent server/client mismatches.
