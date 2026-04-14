# Troubleshooting & Integration Knowledge Base

This document captures the technical hurdles and "ghost" issues encountered during the implementation of the Project Dashboard (Milestone 12).

---

## 🏗️ 1. Nuxt 4 IPC Stability (Vite Worker Crashes)
**Issue:** Developer environment frequently crashed with `IPC connection closed` or `Vite worker failed to start`.
- **Cause:** Inconsistency in `<script>` tag languages across the frontend. Nuxt 4 (and modern Vite) can struggle when TypeScript is expected but `lang="ts"` is missing in `.vue` files.
- **Fix:** Enforced `lang="ts"` on all core pages (Admin, Client, Login).
- **Pro-Tip:** Always verify that both `frontend/app/pages/admin/index.vue` and `frontend/app/pages/client/[id].vue` use explicit TypeScript tags.

## 🔐 2. The "Invisible" Authentication 404
**Issue:** Attempts to log in resulted in a `404 Not Found` error in the browser console.
- **Cause:** This was an internal application exception, not a missing route. Our `authentication.py` logic was raising a `404` if the query for a user returned `None`.
- **Refinement:** Updated the backend to support both **Email and Username** lookups simultaneously.
- **Verification:** Always check the `detail` field in the API response to distinguish between a missing endpoint and a missing user account.

## 💾 3. Seeding Transaction Failures
**Issue:** Even after running the seed script, the admin account appeared to be missing ("User not found").
- **Cause:** SQLAlchemy session management. The initial `seed.py` script was adding the `admin` to the session but only calling `db.commit()` inside conditional loops for *new* clients. If the client already existed, the transaction was never finalized.
- **Fix:** Implemented immediate `db.commit()` calls after every user creation step to ensure persistence regardless of existing data states.

## 🔑 4. JWT Stale Session Recovery
**Issue:** Browser redirects or "Could not validate credentials" errors after database resets.
- **Cause:** Local storage/Cookies contained old JWT tokens. When the database was reset, the `sub` ID in the token no longer matched any user in the new database.
- **Fix:** Implemented a standard "Session Clearing" protocol—instructing users to manually Log Out to clear the `auth_token` cookie and re-synchronize with the new DB state.

## 🖥️ 5. Windows Shell Encoding Errors
**Issue:** The API would crash on startup with a `UnicodeEncodeError`.
- **Cause:** Using non-ASCII characters (like 🚀) in `print()` statements while running in a standard Windows Command Prompt or PowerShell environment.
- **Fix:** Stripped emojis from core backend startup logs to ensure 100% compatibility across all operating systems.

---
*Last Updated: 2026-04-14*
