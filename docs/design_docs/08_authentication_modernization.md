# Milestone Documentation: Authentication Modernization

This document records the migration to a modern authentication engine and the establishment of a robust, production-ready security layer for the Portfolio Platform.

---

## 🏗️ Architectural Overview

The platform's security was overhauled to move away from legacy libraries and adopt modern hashing standards, ensuring longevity and enterprise-grade protection.

### Security Engine Migration
- **Argon2 Adoption**: Replaced the unmaintained `passlib` with `pwdlib[argon2]`. This shift provides superior resistance against brute-force and side-channel attacks.
- **Unified Hash Utility**: Refactored the internal `Hash` service to utilize Argon2 while maintaining API compatibility for existing calls, minimizing refactoring friction.

### JWT & Identity Refinement
- **Multi-Identifier Support**: Updated the `/token` endpoint to allow users to authenticate using either their **Username** or their **Email**, improving the UX of the entry gateway.
- **Enhanced Debugging**: Instrumented `oauth2_util.py` with specific `JWTError` logging, allowing for the immediate detection of expired tokens or malformed signatures in the server console.

### Data Bootstrapping
- **Admin Initialization**: Standardized the creation of the primary `admin` account in PostgreSQL via local seeding scripts, ensuring the platform is operational immediately upon deployment.

---

## 🧪 Walkthrough & Functional Flow

### 1. The Authentication Lifecycle
- **Flow**: User enters credentials (Username or Email) -> Backend validates via Argon2 -> JWT is generated and returned -> Frontend stores the token in a secure `useCookie`.
- **Experience**: The login button displays a loading spinner during validation, and the system provides clear, glassmorphic `UAlert` feedback if credentials fail.

### 2. Session Persistence
- **Experience**: Users remain logged in across page refreshes.
- **Outcome**: The Nuxt application automatically includes the Bearer token in all `useAsyncData` calls, and the backend validates the token for every protected route, enforcing Role-Based Access Control (RBAC).

---

## 📋 Verification Summary

| Feature | Test Case | Result |
| :--- | :--- | :--- |
| **Hashing Engine** | Verify Argon2 signature generation | Successful (Passed) |
| **Multi-ID Login** | Attempt login with Email instead of Username | `200 OK` (Passed) |
| **Token Validation** | Inspect JWT payload for `sub` and `role` claims | Validated (Passed) |
| **Admin Seeding** | Verify admin existence after database reset | Persistent (Passed) |
| **UI Feedback** | Trigger 401 Unauthorized via the login modal | Alert Shown (Passed) |

---

> [!TIP]
> **Next Steps**: With the security layer hardened, we move to **Cloud Run Production Readiness** to finalize the environment variables and container networking.
