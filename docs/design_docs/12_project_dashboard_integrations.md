# Milestone 12: Project Dashboard & External Integrations

## Overview
This milestone evolved the platform from a simple CRUD application to a high-utility project management hub. We implemented a client-facing project dashboard that integrates with external developer tools like GitHub and Trello.

---

## 1. Database Schema Expansion (v2)
To support rich project metadata, the `DbProject` model was expanded with the following nullable fields:
- **`trello_url`**: Direct link to the project's task board.
- **`github_url`**: Path to the source code repository.
- **`github_token`**: Optional Personal Access Token (PAT) for fetching commits from private repositories.
- **`wip_url`**: URL for the live work-in-progress or staging environment.
- **`start_date`**: DateTime to track project inception separately from record creation.

## 2. GitHub API Integration
Implemented a real-time "Version Logs" system in `client/[id].vue`:
- **Commit Fetcher**: A reactive `fetchCommits` function that parses the GitHub URL and interacts with the GitHub REST API (`v3`).
- **Dynamic Headers**: The system automatically detects the presence of a `github_token` and applies it as a Bearer token to authorize requests for private repositories.
- **Loading UX**: Integrated `USkeleton` loaders to provide a premium feel while waiting for external API responses.

## 3. Trello & WIP Orchestration
- **Kanban Workspace**: Created a stylized UI component for Trello board access, ensuring clients have a one-click route to task management.
- **Live Preview CTA**: Added a primary "Rocket Launch" button in the header, enabling immediate access to the project's staging deployment.

## 4. Administrative Omniscience
- **Direct Access**: Updated the Admin Project list with a "View Dashboard" link, allowing administrators to access the client-side dashboard route (`/client/[id]`) directly.
- **Unified Management**: Integrated all new URLs and tokens into the Admin's Creation and Editing modals with a modern multi-column layout.

---

## 🛠️ Troubleshooting & Refinements

### 1. PostgreSQL Schema Sync
- **Issue**: Adding columns to a PostgreSQL database locally using `Base.metadata.create_all` does not alter existing tables.
- **Fix**: Developed a `scratch/reset_db.py` script to drop and recreate the local schema during the development phase, followed by a re-seed of the integration data.

### 2. GitHub URL Parsing
- **Challenge**: Repository URLs can vary (e.g., ending in `.git`).
- **Fix**: Implemented robust string parsing to extract `owner` and `repo` names consistently for API requests.

---
## Final Verification (Local)
1. **Schema**: Confirmed all integration fields are present in the `projects` table.
2. **Commit Logs**: Verified that commits are correctly fetched and displayed for the `portfolio_platform` repo (public example).
3. **Private Access**: Confirmed that the `Authorization` header is correctly applied when a `github_token` is provided.

The platform is now ready for professional client delivery! 🚀
