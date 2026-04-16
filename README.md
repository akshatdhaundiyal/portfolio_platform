# 🚀 Portfolio Platform

A high-performance, full-stack freelance portfolio platform built with **FastAPI** (Backend), **Nuxt.js** (Frontend), and **PostgreSQL**.

This project is fully containerized and optimized for a seamless local development experience with **Live Hot-Reloading** enabled for both frontend and backend.

---

## 🏗️ Project Structure

The project follows a modular service-oriented architecture:

- **`/backend`**: FastAPI application, database models, and migrations.
- **`/frontend`**: Nuxt.js application (Vue 3, TailwindCSS).
- **`/db`**: Database initialization scripts and dummy data.
- **`docker-compose.yml`**: Orchestrates the entire local environment.

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- A local `.env` file (copied from `.env.example`).

### 2. Launch the Stack
Run the following command to build and start all services:
```bash
docker compose up --build
```

### 3. Access the Apps
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000) (Docs at `/docs`)
- **Database**: Port `5432`

---

## 🔥 Development Features

### 🔄 Instant Hot-Reload
- **Backend**: Any change to Python files in `/backend/src` will trigger an instant server reload within the container.
- **Frontend**: Nuxt Hot Module Replacement (HMR) is enabled. Saving a `.vue` or `.ts` file will update the UI immediately.

### 🛡️ Environmental Shielding
The project uses **Anonymous Docker Volumes** for `node_modules` and `.venv`. This prevents "Operating System Clashes" between your host machine (Windows/Mac) and the Linux containers.

### 🔌 Intelligent Networking
- **Public API**: `http://localhost:8000` (Used by your browser).
- **Private API**: `http://backend:8080` (Used internally by Nuxt SSR for faster server-to-server communication).

---

## 📦 Adding Dependencies

To keep environments in sync, adding a new package should be done via a rebuild:

**For Backend:**
1. Add the package to `backend/pyproject.toml`.
2. Run `docker compose up --build backend`.

**For Frontend:**
1. Add the package to `frontend/package.json`.
2. Run `docker compose up --build frontend`.

---

## 🛠️ Maintenance

### Wipe Database & Re-seed
To reset the database and inject fresh dummy data:
```bash
docker compose down -v
docker compose up --build
```

---
*Generated with ❤️ by Antigravity*
