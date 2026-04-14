# Milestone Documentation: Git Workflow & Release Strategy

This document records the establishment of a professional release pipeline and the harmonization of the repository's branch architecture to support safe development and controlled production deployments.

---

## 🏗️ Architectural Overview

The platform previously lacked a clear separation between "Draft" development and "Live" production, resulting in accidental deployments and branch divergence.

### Selective Deployment (v2)
- **Branch Triggers**: Updated the GitHub Actions pipeline to trigger exclusively on the `production` branch.
- **Manual Control**: Integrated `workflow_dispatch`, enabling administrators to trigger deployments manually from the GitHub UI for hotfixes or scheduled releases.

### Repository Harmonization
- **Strict Sync**: Synchronized the `production` branch with `main` via a hard reset, ensuring that both branches share the same modernized folder structure (`backend/src/...`).
- **Cache Sanitization**: Performed a full Git index flush (`rm --cached`) to re-enforce `.gitignore` rules and purge legacy build artifacts from the repository history.

---

## 🧪 Walkthrough & Functional Flow

### 1. The Development Lifecycle
- **Experience**: The developer works on the `main` branch. 
- **Flow**: Commits and pushes to `main` update the development source but **do not** trigger cloud deployments. This allows for rapid iteration and testing without risk to the live platform.

### 2. The Controlled Release
- **Experience**: Merging `main` into `production`.
- **Outcome**: The merge event (or a manual dispatch) triggers the production build. This ensures that only verified, stable code reaches the Cloud Run environment.

---

## 📋 Verification Summary

| Feature | Test Case | Result |
| :--- | :--- | :--- |
| **Pipeline Gating** | Push to `main` and verify Action doesn't run | Gated (Passed) |
| **Branch Alignment** | Compare `main` and `production` file structures | Identical (Passed) |
| **Ignore Enforcement** | Check `git ls-files` for `.nuxt` or `node_modules` | Clean (Passed) |
| **Manual Dispatch** | Trigger a backend deployment manually via GitHub UI | Success (Passed) |

---

> [!TIP]
> **Next Steps**: With the release flow finalized, we move to **Frontend & Backend Integration** to establish the data-binding patterns between the Nuxt UI and FastAPI endpoints.
