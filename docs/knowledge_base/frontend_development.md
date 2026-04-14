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
- **The Pitfall**: Avoid hardcoding visibility toggles in the sidebar. Instead, use a centralized `links` configuration that is filtered dynamically by the application's authentication state and current active domain.

---

## 🏷️ 7. TypeScript Integration & Data Fetching Generics

### The Knowledge
- **Generics**: Always provide a generic type parameter to `useAsyncData<T>` and associated fetchers. This allows the compiler to provide auto-completion and type-checking within the UI templates, preventing "unknown property" errors during production builds.
- **Interface Centralization**: Define `interface` structures for core entities (like `Client` or `Project`) to ensure consistency between the API payload and the UI representation.
- **Defensive Defaults**: When working with collections, provide a default empty list in the `useAsyncData` options (`{ default: () => [] }`) and use the null-coalescing pattern `(data.value || [])` to ensure the UI remains stable during initial load or fetch failures.

---

## 🔔 8. Dynamic Sidebar & Real-time UI Badges

### The Knowledge
- **Avoid Hardcoding**: Early versions used hardcoded strings (e.g., `badge: '3 Active'`) in the sidebar navigation. This leads to user distrust if the data doesn't match the current dashboard state.
- **The Pattern (Computed Links)**:
    - Instead of a static `links` array, use a `computed(() => [...])` property.
    - Fetch counts/stats globally in the component using `useAsyncData`.
    - This ensures that as the user navigates or performs actions (like creating a project), the sidebar updates automatically to reflect the actual database state.
- **SSG/SSR Considerations**: When using `useAsyncData` in shared layouts (like the sidebar), always check for the existence of authentication tokens before fetching to avoid unnecessary 401 errors during the initial public rendering phase.
