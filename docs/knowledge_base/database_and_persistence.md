# Database & Persistence Knowledge

This document logs the "data layer" experiences of the Portfolio Platform.

---

## 🗄️ 1. Ephemeral vs Persistent Storage

### The Knowledge
- **The Shift**: The project migrated from local-only SQLite to managed PostgreSQL (Neon Tech).
- **The Requirement**: Standardizing on PostgreSQL early prevented the "it works on my machine" data divergence usually seen when moving from SQLite-local to PG-production.

---

## 🌱 2. Seeding Strategies & Transaction Integrity

### The Problem
During development, the "Admin" user would sometimes fail to be created even though the seeding script finished "successfully".

### The Knowledge
- **The Cause (Session Flush)**: SQLAlchemy session transactions. In early versions of `seed.py`, `db.commit()` was only called at the very end. If a single item in a large loop failed or didn't meet a condition, the entire batch could remain "un-persisted" in the session.
- **The Fix**: Implement immediate `db.commit()` calls after every primary user creation step. This ensures that the essential "Admin" account exists even if supplementary mock data fails to load.

---

## 🏗️ 3. Pre-Alembic Schema Evolution

### The Knowledge
- **The State**: Currently, the project is in a high-iteration phase without Alembic migrations.
- **The Workflow**:
    1. Update `models.py`.
    2. Drop the existing tables (if changing columns/types).
    3. Run `models.Base.metadata.create_all(engine)`.
    4. Run `seed.py` to restore the environment.
- **The Bug**: "Column already exists" or "Table not found" errors after a partial migration.
- **The Lesson**: Always ensure you have a "Total Reset" script that drops all tables before recreating them to ensure a clean, consistent schema across local and production environments.

---

## 🔑 4. Stale Session Recovery (User-Side)

### The Problem
After a database reset, logged-in users would experience weird 404s or 401s even though their cookie existed.

### The Knowledge
- **The Cause**: The browser's JWT cookie contained a User ID (`sub`) that no longer matched any record in the newly reset database.
- **The Fix**: Implement a "Clear Everything" logout button. Developers must manually clear the `auth_token` cookie after any major database destruction to re-synchronize the client state with the new DB reality.

---

## ⛓️ 5. SQLAlchemy Relationship Discovery

### The Knowledge
- **Constraint**: Always define `relationship()` on *both strings* of a foreign key relationship (e.g., `DbProject.owner` and `DbUser.projects`).
- **The "Why"**: While one-way keys work for SQL, SQLAlchemy's lazy-loading and ORM navigation become significantly more stable and intuitive when dual relationships are explicitly declared.
- **Eager Loading**: For high-traffic areas like the Project Dashboard, use `joinedload` or `subqueryload` in queries to prevent the "N+1 Problem" (making multiple database calls for every related record).

---

## 📜 6. Versioned Acceptance Criteria & History

### The Knowledge
- **The Requirement**: Capture every change to project requirements (scope creep prevention).
- **Implementation**: Used a `project_criteria_history` table as an "Append-Only" log. Every time `acceptance_criteria` is updated, a new record is created with the author's ID and a timestamp.
- **The Pitfall**: Don't just update the main project record; without the history log, you lose accountability for scope changes.
- **Normalization**: Keep the "Latest" version of criteria on the `DbProject` main table for fast reads, and use the history table purely for auditing and timeline views.
