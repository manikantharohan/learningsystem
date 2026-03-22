# Next.js Application Structure

<cite>
**Referenced Files in This Document**
- [frontend/app/layout.tsx](file://frontend/app/layout.tsx)
- [frontend/app/(auth)/layout.tsx](file://frontend/app/(auth)/layout.tsx)
- [frontend/app/(app)/layout.tsx](file://frontend/app/(app)/layout.tsx)
- [frontend/app/(auth)/login/page.tsx](file://frontend/app/(auth)/login/page.tsx)
- [frontend/app/(auth)/register/page.tsx](file://frontend/app/(auth)/register/page.tsx)
- [frontend/app/(app)/dashboard/page.tsx](file://frontend/app/(app)/dashboard/page.tsx)
- [frontend/app/(public)/courses/page.tsx](file://frontend/app/(public)/courses/page.tsx)
- [frontend/app/page.tsx](file://frontend/app/page.tsx)
- [frontend/app/store/authStore.ts](file://frontend/app/store/authStore.ts)
- [frontend/app/store/courseStore.ts](file://frontend/app/store/courseStore.ts)
- [frontend/app/lib/api.ts](file://frontend/app/lib/api.ts)
- [frontend/next.config.js](file://frontend/next.config.js)
- [frontend/tsconfig.json](file://frontend/tsconfig.json)
- [frontend/tailwind.config.ts](file://frontend/tailwind.config.ts)
- [frontend/postcss.config.js](file://frontend/postcss.config.js)
- [frontend/package.json](file://frontend/package.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document explains the Next.js application structure for the learning platform, focusing on the App Router configuration, route groups, and layout hierarchy. It covers how the application organizes pages under route groups such as (app), (auth), and (public), how layouts inherit and compose, and how navigation and authentication flow work. It also documents Next.js configuration, TypeScript setup, and Tailwind CSS integration.

## Project Structure
The frontend follows Next.js App Router conventions with a conventional app directory. Route groups are used to organize related pages without affecting URLs:
- (app): Protected area for authenticated users (dashboard, internal navigation)
- (auth): Authentication pages (login, register)
- (public): Publicly accessible pages (courses listing)
- Root-level pages (home page, global layout)

```mermaid
graph TB
subgraph "Root"
root_layout["app/layout.tsx<br/>Root Layout"]
home_page["app/page.tsx<br/>Home Page"]
end
subgraph "Route Groups"
auth_group["app/(auth)<br/>Auth Group"]
app_group["app/(app)<br/>App Group"]
public_group["app/(public)<br/>Public Group"]
end
subgraph "Auth Pages"
login_page["app/(auth)/login/page.tsx"]
register_page["app/(auth)/register/page.tsx"]
auth_layout["app/(auth)/layout.tsx"]
end
subgraph "App Pages"
dashboard_page["app/(app)/dashboard/page.tsx"]
app_layout["app/(app)/layout.tsx"]
end
subgraph "Public Pages"
courses_page["app/(public)/courses/page.tsx"]
end
root_layout --> auth_group
root_layout --> app_group
root_layout --> public_group
root_layout --> home_page
auth_group --> login_page
auth_group --> register_page
auth_group --> auth_layout
app_group --> dashboard_page
app_group --> app_layout
public_group --> courses_page
```

**Diagram sources**
- [frontend/app/layout.tsx](file://frontend/app/layout.tsx)
- [frontend/app/page.tsx](file://frontend/app/page.tsx)
- [frontend/app/(auth)/layout.tsx](file://frontend/app/(auth)/layout.tsx)
- [frontend/app/(auth)/login/page.tsx](file://frontend/app/(auth)/login/page.tsx)
- [frontend/app/(auth)/register/page.tsx](file://frontend/app/(auth)/register/page.tsx)
- [frontend/app/(app)/layout.tsx](file://frontend/app/(app)/layout.tsx)
- [frontend/app/(app)/dashboard/page.tsx](file://frontend/app/(app)/dashboard/page.tsx)
- [frontend/app/(public)/courses/page.tsx](file://frontend/app/(public)/courses/page.tsx)

**Section sources**
- [frontend/app/layout.tsx](file://frontend/app/layout.tsx)
- [frontend/app/page.tsx](file://frontend/app/page.tsx)
- [frontend/app/(auth)/layout.tsx](file://frontend/app/(auth)/layout.tsx)
- [frontend/app/(auth)/login/page.tsx](file://frontend/app/(auth)/login/page.tsx)
- [frontend/app/(auth)/register/page.tsx](file://frontend/app/(auth)/register/page.tsx)
- [frontend/app/(app)/layout.tsx](file://frontend/app/(app)/layout.tsx)
- [frontend/app/(app)/dashboard/page.tsx](file://frontend/app/(app)/dashboard/page.tsx)
- [frontend/app/(public)/courses/page.tsx](file://frontend/app/(public)/courses/page.tsx)

## Core Components
- Root layout: Provides global metadata, theme provider, and typography setup.
- Auth layout: Wraps authentication pages with a minimal container.
- App layout: Manages sidebar navigation, theme switching, user profile, and guards unauthenticated access.
- Store modules: Centralized state for authentication and course data.
- API module: Unified client for backend endpoints.

Key responsibilities:
- Layout inheritance: Root layout wraps all pages; route groups add their own wrappers.
- Navigation: Links within layouts and pages navigate using Next.js Link and router.
- Authentication: Guards protected routes and redirects unauthenticated users to login.

**Section sources**
- [frontend/app/layout.tsx](file://frontend/app/layout.tsx)
- [frontend/app/(auth)/layout.tsx](file://frontend/app/(auth)/layout.tsx)
- [frontend/app/(app)/layout.tsx](file://frontend/app/(app)/layout.tsx)
- [frontend/app/store/authStore.ts](file://frontend/app/store/authStore.ts)
- [frontend/app/store/courseStore.ts](file://frontend/app/store/courseStore.ts)
- [frontend/app/lib/api.ts](file://frontend/app/lib/api.ts)

## Architecture Overview
The application uses Next.js App Router with route groups to segment concerns. The root layout defines global providers and metadata. Route groups encapsulate related pages and optional shared layouts. Protected areas rely on client-side guards and stores to enforce access control.

```mermaid
graph TB
A["Browser Request"] --> B["Root Layout<br/>app/layout.tsx"]
B --> C{"Route Group?"}
C --> |"(auth)"| D["Auth Layout<br/>app/(auth)/layout.tsx"]
C --> |"(app)"| E["App Layout<br/>app/(app)/layout.tsx"]
C --> |"(public)"| F["Public Layout<br/>implicit"]
C --> |None| G["Root Page<br/>app/page.tsx"]
D --> H["Login Page<br/>app/(auth)/login/page.tsx"]
D --> I["Register Page<br/>app/(auth)/register/page.tsx"]
E --> J["Dashboard Page<br/>app/(app)/dashboard/page.tsx"]
F --> K["Courses Page<br/>app/(public)/courses/page.tsx"]
```

**Diagram sources**
- [frontend/app/layout.tsx](file://frontend/app/layout.tsx)
- [frontend/app/(auth)/layout.tsx](file://frontend/app/(auth)/layout.tsx)
- [frontend/app/(auth)/login/page.tsx](file://frontend/app/(auth)/login/page.tsx)
- [frontend/app/(auth)/register/page.tsx](file://frontend/app/(auth)/register/page.tsx)
- [frontend/app/(app)/layout.tsx](file://frontend/app/(app)/layout.tsx)
- [frontend/app/(app)/dashboard/page.tsx](file://frontend/app/(app)/dashboard/page.tsx)
- [frontend/app/(public)/courses/page.tsx](file://frontend/app/(public)/courses/page.tsx)
- [frontend/app/page.tsx](file://frontend/app/page.tsx)

## Detailed Component Analysis

### Root Layout and Global Providers
- Defines site metadata and font loading.
- Wraps children with a theme provider for light/dark mode support.
- Applies global CSS and sets HTML attributes.

```mermaid
flowchart TD
Start(["Render Root Layout"]) --> Meta["Set Metadata"]
Meta --> Font["Load Inter Font"]
Font --> ThemeWrap["Wrap with Theme Provider"]
ThemeWrap --> Children["Render Child Page"]
Children --> End(["Finish Render"])
```

**Diagram sources**
- [frontend/app/layout.tsx](file://frontend/app/layout.tsx)

**Section sources**
- [frontend/app/layout.tsx](file://frontend/app/layout.tsx)

### Auth Route Group and Pages
- Auth layout provides a minimal wrapper for login and register.
- Login page handles form submission, redirects on success, and displays errors from the store.
- Register page manages registration flow and redirects to login on success.

```mermaid
sequenceDiagram
participant U as "User"
participant L as "Login Page"
participant S as "Auth Store"
participant R as "Router"
U->>L : Submit credentials
L->>S : login(email, password)
S-->>L : {user, isAuthenticated} or error
alt Success
L->>R : push("/dashboard")
else Error
L-->>U : Show error message
end
```

**Diagram sources**
- [frontend/app/(auth)/login/page.tsx](file://frontend/app/(auth)/login/page.tsx)
- [frontend/app/store/authStore.ts](file://frontend/app/store/authStore.ts)

**Section sources**
- [frontend/app/(auth)/layout.tsx](file://frontend/app/(auth)/layout.tsx)
- [frontend/app/(auth)/login/page.tsx](file://frontend/app/(auth)/login/page.tsx)
- [frontend/app/(auth)/register/page.tsx](file://frontend/app/(auth)/register/page.tsx)
- [frontend/app/store/authStore.ts](file://frontend/app/store/authStore.ts)

### App Route Group and Dashboard
- App layout enforces authentication via guards and redirects to login when unauthenticated.
- Provides a sidebar with navigation links and a theme toggle.
- Dashboard page consumes course and gamification stores to render user stats and course previews.

```mermaid
flowchart TD
A["App Layout Mount"] --> B["fetchUser()"]
B --> C{"isAuthenticated?"}
C --> |No| D["router.push('/login')"]
C --> |Yes| E["Render Sidebar + Main Content"]
E --> F["Dashboard Page Renders"]
```

**Diagram sources**
- [frontend/app/(app)/layout.tsx](file://frontend/app/(app)/layout.tsx)
- [frontend/app/(app)/dashboard/page.tsx](file://frontend/app/(app)/dashboard/page.tsx)
- [frontend/app/store/authStore.ts](file://frontend/app/store/authStore.ts)

**Section sources**
- [frontend/app/(app)/layout.tsx](file://frontend/app/(app)/layout.tsx)
- [frontend/app/(app)/dashboard/page.tsx](file://frontend/app/(app)/dashboard/page.tsx)
- [frontend/app/store/authStore.ts](file://frontend/app/store/authStore.ts)
- [frontend/app/store/courseStore.ts](file://frontend/app/store/courseStore.ts)

### Public Route Group and Courses Listing
- Courses page lists subjects, shows loading skeletons, and navigates to course details.
- Uses course store to fetch and display subject data.

```mermaid
sequenceDiagram
participant P as "Courses Page"
participant CS as "Course Store"
participant API as "Subjects API"
P->>CS : fetchSubjects()
CS->>API : GET /subjects
API-->>CS : {subjects}
CS-->>P : Update state
P-->>P : Render subject cards
```

**Diagram sources**
- [frontend/app/(public)/courses/page.tsx](file://frontend/app/(public)/courses/page.tsx)
- [frontend/app/store/courseStore.ts](file://frontend/app/store/courseStore.ts)
- [frontend/app/lib/api.ts](file://frontend/app/lib/api.ts)

**Section sources**
- [frontend/app/(public)/courses/page.tsx](file://frontend/app/(public)/courses/page.tsx)
- [frontend/app/store/courseStore.ts](file://frontend/app/store/courseStore.ts)
- [frontend/app/lib/api.ts](file://frontend/app/lib/api.ts)

### Home Page Composition
- Home page showcases hero, features, and call-to-action sections.
- Uses motion animations and Tailwind utilities for responsive design.

**Section sources**
- [frontend/app/page.tsx](file://frontend/app/page.tsx)

## Dependency Analysis
- Next.js configuration enables App Router and API rewrites to backend.
- TypeScript configuration uses bundler module resolution and path aliases.
- Tailwind CSS scans app components and supports dark mode and custom animations.
- Stores depend on the API client for HTTP requests.

```mermaid
graph LR
Next["next.config.js"] --> AppDir["App Router Enabled"]
Next --> Rewrites["/api/* Rewrites"]
TS["tsconfig.json"] --> Paths["@/*, @components/*, @store/*, @lib/*"]
Tailwind["tailwind.config.ts"] --> Dark["Dark Mode: class"]
Tailwind --> Anim["Custom Animations"]
AuthStore["authStore.ts"] --> API["lib/api.ts"]
CourseStore["courseStore.ts"] --> API
API --> Backend["Backend API"]
```

**Diagram sources**
- [frontend/next.config.js](file://frontend/next.config.js)
- [frontend/tsconfig.json](file://frontend/tsconfig.json)
- [frontend/tailwind.config.ts](file://frontend/tailwind.config.ts)
- [frontend/app/store/authStore.ts](file://frontend/app/store/authStore.ts)
- [frontend/app/store/courseStore.ts](file://frontend/app/store/courseStore.ts)
- [frontend/app/lib/api.ts](file://frontend/app/lib/api.ts)

**Section sources**
- [frontend/next.config.js](file://frontend/next.config.js)
- [frontend/tsconfig.json](file://frontend/tsconfig.json)
- [frontend/tailwind.config.ts](file://frontend/tailwind.config.ts)
- [frontend/postcss.config.js](file://frontend/postcss.config.js)
- [frontend/package.json](file://frontend/package.json)

## Performance Considerations
- App Router: Enablement improves static generation and route handling.
- Image optimization: Configure allowed domains for external images.
- Rewrites: Proxy /api/* to backend to avoid CORS and simplify client code.
- CSS scanning: Tailwind scans app directory to purge unused styles.
- Client-side caching: Zustand persistence for auth reduces redundant requests.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Authentication redirect loop: Verify token presence and store hydration; ensure guards run after initial hydration.
- API rewrites failing: Confirm NEXT_PUBLIC_API_URL is set and rewrite target matches backend.
- Tailwind utilities missing: Ensure content globs include app directory and rebuild.
- TypeScript path aliases: Confirm tsconfig paths match imports and Next.js recognizes them.

**Section sources**
- [frontend/app/(app)/layout.tsx](file://frontend/app/(app)/layout.tsx)
- [frontend/next.config.js](file://frontend/next.config.js)
- [frontend/tailwind.config.ts](file://frontend/tailwind.config.ts)
- [frontend/tsconfig.json](file://frontend/tsconfig.json)

## Conclusion
The application leverages Next.js App Router with route groups to cleanly separate authentication, protected application views, and public content. Layouts inherit from the root layout and optionally wrap route groups. State management via stores integrates with a unified API client, while configuration files define routing, TypeScript, and styling. This structure supports scalable navigation, robust authentication flows, and maintainable component composition.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### Route Group Usage Examples
- (auth): Wrap login and register pages with a minimal layout and apply client-side guards.
- (app): Protect dashboard and internal pages with an authenticated layout and navigation.
- (public): Expose courses listing without authentication.

**Section sources**
- [frontend/app/(auth)/layout.tsx](file://frontend/app/(auth)/layout.tsx)
- [frontend/app/(auth)/login/page.tsx](file://frontend/app/(auth)/login/page.tsx)
- [frontend/app/(auth)/register/page.tsx](file://frontend/app/(auth)/register/page.tsx)
- [frontend/app/(app)/layout.tsx](file://frontend/app/(app)/layout.tsx)
- [frontend/app/(app)/dashboard/page.tsx](file://frontend/app/(app)/dashboard/page.tsx)
- [frontend/app/(public)/courses/page.tsx](file://frontend/app/(public)/courses/page.tsx)

### Layout Composition Patterns
- Root layout provides global providers and metadata.
- Route group layouts wrap pages within the same group.
- Nested layouts combine to form a hierarchy: Root -> Group -> Page.

**Section sources**
- [frontend/app/layout.tsx](file://frontend/app/layout.tsx)
- [frontend/app/(auth)/layout.tsx](file://frontend/app/(auth)/layout.tsx)
- [frontend/app/(app)/layout.tsx](file://frontend/app/(app)/layout.tsx)

### Navigation Patterns
- Use Next.js Link for client-side navigation within the app.
- Use router hooks to programmatically navigate after authentication actions.
- Maintain consistent sidebar navigation in the app layout.

**Section sources**
- [frontend/app/(app)/layout.tsx](file://frontend/app/(app)/layout.tsx)
- [frontend/app/(auth)/login/page.tsx](file://frontend/app/(auth)/login/page.tsx)
- [frontend/app/(auth)/register/page.tsx](file://frontend/app/(auth)/register/page.tsx)
- [frontend/app/(public)/courses/page.tsx](file://frontend/app/(public)/courses/page.tsx)

### Next.js Configuration Options
- App Router enabled for modern routing and static generation.
- Image domains whitelisted for optimized images.
- API rewrites proxy requests to backend.

**Section sources**
- [frontend/next.config.js](file://frontend/next.config.js)

### TypeScript Setup
- Strict mode enabled with bundler module resolution.
- Path aliases for components, stores, and libraries.
- Plugins configured for Next.js TypeScript integration.

**Section sources**
- [frontend/tsconfig.json](file://frontend/tsconfig.json)

### Build Optimization Settings
- Tailwind CSS configured with content scanning and dark mode support.
- PostCSS pipeline includes Tailwind and Autoprefixer.
- Package scripts for development, production, linting, and type checking.

**Section sources**
- [frontend/tailwind.config.ts](file://frontend/tailwind.config.ts)
- [frontend/postcss.config.js](file://frontend/postcss.config.js)
- [frontend/package.json](file://frontend/package.json)