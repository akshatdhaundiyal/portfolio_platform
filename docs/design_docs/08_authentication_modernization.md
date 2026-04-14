# Milestone 8: Authentication Modernization & Admin Initialization

## Implementation Plan Overview
Goal: Replace the unmaintained `passlib` library with a modern, compatible, and widely used authentication engine (`pwdlib`) and initialize the system's admin account in the PostgreSQL database.

### Proposed Changes

#### 1. Dependency Migration
- **Uninstalled**: `passlib` and the legacy `bcrypt` library.
- **Installed**: `pwdlib[argon2]`. Shifting to **Argon2** provides superior security over the older bcrypt standard and full compatibility with modern Python environments.

#### 2. Authentication Reflow
- **`backend/src/utils/auth_service/hash.py`**: Refactored to utilize `pwdlib.PasswordHash.recommended()`. This ensures the backend always uses the most secure hashing algorithm available while maintaining a clean, simple API for the rest of the application.
- **`Hash` Utility**: The method names (`bcrypt`, `verify`) were preserved to prevent breaking changes in the `authentication.py` router, but the underlying engine now correctly utilizes Argon2.

#### 3. User Data Initialization
- **SQLite Removal**: Permanently deleted the legacy `backend/fastapi_instagram.db` SQLite file.
- **Admin Account**: Created the primary administrative user in local PostgreSQL:
    - **Username**: `admin`
    - **Email**: `admin@example.com`
    - **Password**: `admin12321` (Hashed via Argon2)
    - **Role**: `admin`

#### 3. UX Integration
- **`UAlert` Feedback**: Added a reactive alert system to the login modal that provides immediate feedback for invalid credentials or server errors.
- **Loading States**: Implemented button loading states during authentication to prevent duplicate requests and improve the premium feel.

### 4. JWT Resilience & Troubleshooting
During the integration phase, we refined the security layer to handle real-world edge cases:
- **X-Ray Logging**: Refactored `oauth2_util.py` to capture and log raw `JWTError` exceptions to the server console. This allows developers to distinguish between "Expired Tokens," "Invalid Signatures," and "Malformed Headers" instantly.
- **Cookie Synchronization Protocol**: Documented the "Stale Cookie" phenomenon where browsers retain tokens from different development micro-sessions. Established a protocol for clearing browser security cookies after breaking backend changes.
- **Route Protection Fixes**: Corrected a parameter mismatch in the `get_user_by_id` and `get_all_users` endpoints to ensure the database session is consistently passed during token validation.

---

## Verification
1. **Payload Inspection**: Verified that the JWT payload correctly contains the `sub` (User ID).
2. **Persistence**: Confirmed that `useCookie` correctly stores the `auth_token` and persists it across dashboard refreshes.
3. **Role Validation**: Verified that the backend successfully extracts and validates the `admin` role from the decoded token before serving sensitive data.
4. **Modern Hashing**: Verified `Hash.verify()` returns `True` for correctly hashed strings using the new `pwdlib` engine.
5. **Database Integrity**: Confirmed the `admin` user was successfully inserted into the `users` table via the `add_admin.py` initialization script.
6. **Future Proofing**: By moving to `pwdlib`, we have cleared the maintenance debt associated with `passlib`, ensuring the project remains compatible with upcoming Python versions and security standards.

You can now log in at the portal with the credentials provided above.
