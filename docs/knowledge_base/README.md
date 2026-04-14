# Project Knowledge Base: Portfolio Platform

This directory serves as the "Source of Truth" for all technical knowledge, debugging experiences, and architectural decisions made during the development of the Portfolio Platform. It is a living document intended to prevent the recurrence of past issues and accelerate future features.

## 🗂️ Categories

### 🐍 [Backend Development](file:///d:/self_work/projects/portfolio_platform/docs/knowledge_base/backend_development.md)
Detailed logs of FastAPI implementation, robust RBAC logic, authentication modernization, and API design patterns.

### 🟢 [Frontend Development](file:///d:/self_work/projects/portfolio_platform/docs/knowledge_base/frontend_development.md)
Documentation on Nuxt 3 full-stack integration, UI aesthetics (Nuxt UI), hydration fixes, and client-side security.

### 🚀 [DevOps & Cloud](file:///d:/self_work/projects/portfolio_platform/docs/knowledge_base/devops_and_cloud.md)
Experience with Google Cloud Run deployments, Docker containerization with `uv`, and GitHub Actions CI/CD pipelines.

### 💾 [Database & Persistence](file:///d:/self_work/projects/portfolio_platform/docs/knowledge_base/database_and_persistence.md)
Insights into PostgreSQL (Neon) connectivity, database seeding strategies, and the pre-Alembic schema workflow.

---
## 💡 Why this exists
In complex full-stack projects, "ghost bugs" often reappear if their root causes aren't well-documented. This knowledge base captures:
- **The Problem**: What broke and why it was misleading.
- **The Fix**: The specific technical resolution.
- **The Lesson**: How to avoid the same issue in future modules.

> [!TIP]
> **Always search here first** before debugging a recurring issue like 500 errors in production or hydration mismatches in Nuxt.
