# Frontend Development Knowledge: Vue & Nuxt 3

This document logs the "pitfalls" and architectural successes of the Portfolio Platform's frontend.

---

## 🏗️ 1. Nuxt 4 / Vite IPC Stability

### The Problem
During development, the environment would frequently crash with `IPC connection closed` or `Vite worker failed to start`.

### The Knowledge
- **The Cause**: Mismatched scripting languages. Nuxt's modern Vite bundler can enter an unstable state if it expects TypeScript globally but encounters `.vue` files without explicit `lang="ts"` tags in their `<script>` sections.
- **The Fix**: Enforce `lang="ts"` across all core layouts and pages. This stabilizes the worker threads and ensures type-safety during the HMR (Hot Module Replacement) process.

---

## 💧 2. Hydration & State Mismatches

### The Problem
The browser console frequently showed "Hydration mismatch" warnings, specifically around dates and system-generated strings.

### The Knowledge
- **The Cause**: Server-side rendering (SSR) generates one version of the HTML (e.g., using UTC time), while the Client-side execution generates another (using the user's local timezone). 
- **The Fix**: 
    - Wrap components that rely on local browser APIs (like `toLocaleDateString()` or `window.innerWidth`) in `<ClientOnly>` tags.
    - Provide a placeholder (e.g., a skeleton loader) during the transition to ensure the initial HTML is stable.

---

## 🎨 3. Aesthetic Consistency: Premium Nuxt UI

### The Knowledge
- **Standard**: The project uses a "Premium Dark" theme featuring glassmorphism (translucent backgrounds with blur).
- **Component Policy**: Avoid naked HTML or standard CSS modules for core interactive elements. Always use Nuxt UI (`UButton`, `UInput`, `UCard`) to inherit the project's global styling tokens.
- **Visual Micro-animations**: Use background "blobs" and CSS transform transitions for a "responsive and alive" feel.

---

## 🔐 4. Cross-Origin (CORS) & Cookie Persistence

### The Problem
Browser security policies often blocked the storage of JWT tokens sent from the backend.

### The Knowledge
- **Credentialed Requests**: To store cookies across different subdomains or ports (Localhost 3000 vs 8000), the frontend `useFetch` calls must explicitly set `credentials: 'include'`.
- **Nuxt `useCookie` Utility**: Use the native `useCookie` composable to manage session tokens. This ensures the cookie is accessible both during SSR and Client execution, preventing "Invisible 401" errors where the first server-load thinks the user is logged out while the second client-load thinks they are logged in.

---

## 📊 5. Third-Party Integration: GitHub & Trello

### The Knowledge
- **Security**: Never expose API tokens (like GitHub Personal Access Tokens) in the client-side code.
- **Architecture**: The frontend should query the *backend* for integration data. The backend acts as a secure proxy, fetching the data from GitHub/Trello using server-side secrets and returning a cleaned, processed payload to the UI.
- **Performance**: Use Nuxt's `lazy` fetching options for dashboard widgets to prevent the main page from blocking while waiting for external API responses.

---

## 🧭 6. Dynamic Sidebar & Layout Adaptation

### The Knowledge
- **The Concept**: The application uses a "morphing" sidebar that adapts based on the user's route.
- **Implementation**: The `sidebar.vue` logic relies on the current route prefix (e.g., `/admin`, `/client`) to switch between Public, Private Admin, and Private Client navigation links.
- **The Pitfall**: Avoid hardcoding visibility toggles in the sidebar. Instead, use a centralized `links` configuration that is filtered dynamically by the application's authentication state and current active domain.
