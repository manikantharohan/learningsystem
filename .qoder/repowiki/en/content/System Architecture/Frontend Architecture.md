# Frontend Architecture

<cite>
**Referenced Files in This Document**
- [layout.tsx](file://frontend/app/layout.tsx)
- [page.tsx](file://frontend/app/page.tsx)
- [next.config.js](file://frontend/next.config.js)
- [tsconfig.json](file://frontend/tsconfig.json)
- [package.json](file://frontend/package.json)
- [(auth)\layout.tsx](file://frontend/app/(auth)/layout.tsx)
- [(app)\layout.tsx](file://frontend/app/(app)/layout.tsx)
- [(public)\courses\page.tsx](file://frontend/app/(public)/courses/page.tsx)
- [authStore.ts](file://frontend/app/store/authStore.ts)
- [courseStore.ts](file://frontend/app/store/courseStore.ts)
- [aiStore.ts](file://frontend/app/store/aiStore.ts)
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

## Introduction
This document describes the frontend architecture of the Next.js application. It focuses on the App Router structure with route groups, component organization, state management using Zustand stores, and API integration patterns. It also explains the layout hierarchy, protected routes implementation, component composition patterns, and performance optimization techniques. The backend is proxied via Next.js rewrites to simplify API access from the frontend.

## Project Structure
The frontend follows Next.js App Router conventions with route groups to organize pages by purpose:
- Public area: routes under (public) for unauthenticated access (e.g., courses listing).
- Authentication area: routes under (auth) for login and registration.
- Application area: routes under (app) for authenticated experiences (e.g., dashboard, protected layouts).

Key configuration highlights:
- Rewrites proxy API requests from /api/* to the backend API URL.
- Path aliases configured for cleaner imports (@components, @store, @lib).
- Strict TypeScript compiler options and bundler module resolution.

```mermaid
graph TB
subgraph "App Router"
Public["Route Group (public)"]
Auth["Route Group (auth)"]
App["Route Group (app)"]
end
Public --> Courses["/courses/page.tsx"]
Auth --> Login["/login/page.tsx"]
Auth --> Register["/register/page.tsx"]
App --> Dashboard["/dashboard/page.tsx"]
App --> LayoutApp["(app)/layout.tsx"]
LayoutApp --> ProtectedContent["Protected Pages"]
RootLayout["Root Layout<br/>app/layout.tsx"] --> Public
RootLayout --> Auth
RootLayout --> App
```

**Diagram sources**
- [layout.tsx:13-27](file://frontend/app/layout.tsx#L13-L27)
- [(public)\courses\page.tsx](file://frontend/app/(public)/courses/page.tsx#L1-L97)
- [(auth)\layout.tsx](file://frontend/app/(auth)/layout.tsx#L1-L12)
- [(app)\layout.tsx](file://frontend/app/(app)/layout.tsx#L1-L117)

**Section sources**
- [layout.tsx:1-28](file://frontend/app/layout.tsx#L1-L28)
- [next.config.js:1-20](file://frontend/next.config.js#L1-L20)
- [tsconfig.json:1-30](file://frontend/tsconfig.json#L1-L30)

## Core Components
- Root layout initializes theming and global styles.
- Home page demonstrates animated hero, features, and call-to-action sections.
- Public courses page fetches and renders subject listings with loading states and animations.
- Auth layout wraps authentication pages.
- App layout manages navigation, theme switching, user profile, logout, and protected routing.

**Section sources**
- [layout.tsx:1-28](file://frontend/app/layout.tsx#L1-L28)
- [page.tsx:1-165](file://frontend/app/page.tsx#L1-L165)
- [(public)\courses\page.tsx](file://frontend/app/(public)/courses/page.tsx#L1-L97)
- [(auth)\layout.tsx](file://frontend/app/(auth)/layout.tsx#L1-L12)
- [(app)\layout.tsx](file://frontend/app/(app)/layout.tsx#L1-L117)

## Architecture Overview
The frontend uses:
- Next.js App Router with route groups to separate concerns.
- Zustand stores for local state management (authentication, AI assistant, course management).
- Axios-based API client abstraction for backend communication.
- Rewrites to proxy /api/* to the backend API URL.
- Tailwind CSS for styling and next-themes for theme management.

```mermaid
graph TB
subgraph "Frontend"
RL["Root Layout<br/>app/layout.tsx"]
AL["App Layout<br/>(app)/layout.tsx"]
CL["Courses Page<br/>(public)/courses/page.tsx"]
AS["Auth Store<br/>store/authStore.ts"]
CS["Course Store<br/>store/courseStore.ts"]
AIS["AI Store<br/>store/aiStore.ts"]
AX["Axios Config<br/>app/lib/axios.ts"]
APIClient["API Client<br/>app/lib/api.ts"]
end
subgraph "Backend"
BE["Next.js Backend<br/>/api/* routes"]
end
RL --> AL
RL --> CL
AL --> AS
CL --> CS
CL --> AIS
AS --> APIClient
CS --> APIClient
AIS --> APIClient
APIClient --> AX
AX --> BE
```

**Diagram sources**
- [layout.tsx:1-28](file://frontend/app/layout.tsx#L1-L28)
- [(app)\layout.tsx](file://frontend/app/(app)/layout.tsx#L1-L117)
- [(public)\courses\page.tsx](file://frontend/app/(public)/courses/page.tsx#L1-L97)
- [authStore.ts:1-98](file://frontend/app/store/authStore.ts#L1-L98)
- [courseStore.ts:1-121](file://frontend/app/store/courseStore.ts#L1-L121)
- [aiStore.ts:1-129](file://frontend/app/store/aiStore.ts#L1-L129)

## Detailed Component Analysis

### Route Groups and Layout Hierarchy
- Root layout sets up theming and global metadata.
- (auth) layout provides a minimal wrapper for login/register pages.
- (app) layout handles authentication checks, navigation sidebar, theme switcher, user profile, and logout. It also fetches user data on mount and redirects unauthenticated users away from protected areas.

```mermaid
sequenceDiagram
participant Browser as "Browser"
participant AppLayout as "(app)/layout.tsx"
participant AuthStore as "authStore.ts"
participant Router as "Next Router"
Browser->>AppLayout : Render (app) layout
AppLayout->>AuthStore : fetchUser()
AuthStore-->>AppLayout : user, isAuthenticated
AppLayout->>Router : push("/login") if !isAuthenticated and not on /login or /register
```

**Diagram sources**
- [(app)\layout.tsx](file://frontend/app/(app)/layout.tsx#L1-L117)
- [authStore.ts:74-88](file://frontend/app/store/authStore.ts#L74-L88)

**Section sources**
- [layout.tsx:1-28](file://frontend/app/layout.tsx#L1-L28)
- [(auth)\layout.tsx](file://frontend/app/(auth)/layout.tsx#L1-L12)
- [(app)\layout.tsx](file://frontend/app/(app)/layout.tsx#L1-L117)

### Protected Routes Implementation
- The (app) layout enforces protection by checking authentication state and redirecting to /login when necessary.
- It also fetches user data on mount to hydrate the auth store.

```mermaid
flowchart TD
Start(["Render (app) layout"]) --> CheckAuth["Check isAuthenticated"]
CheckAuth --> |No| Redirect["Redirect to /login"]
CheckAuth --> |Yes| RenderSidebar["Render sidebar and content"]
Redirect --> End(["Done"])
RenderSidebar --> End
```

**Diagram sources**
- [(app)\layout.tsx](file://frontend/app/(app)/layout.tsx#L20-L28)

**Section sources**
- [(app)\layout.tsx](file://frontend/app/(app)/layout.tsx#L1-L117)

### Component Composition Patterns
- Home page composes animated sections with motion primitives and links to explore courses and sign up.
- Courses page composes a grid of subject cards, loading skeletons, and navigational links, driven by the course store.

```mermaid
graph LR
HomePage["Home Page<br/>app/page.tsx"] --> Hero["Hero Section"]
HomePage --> Features["Features Section"]
HomePage --> CTA["Call-to-Action Section"]
CoursesPage["Courses Page<br/>(public)/courses/page.tsx"] --> Loading["Loading Skeletons"]
CoursesPage --> Cards["Subject Cards Grid"]
CoursesPage --> Links["Navigation Links"]
```

**Diagram sources**
- [page.tsx:1-165](file://frontend/app/page.tsx#L1-L165)
- [(public)\courses\page.tsx](file://frontend/app/(public)/courses/page.tsx#L1-L97)

**Section sources**
- [page.tsx:1-165](file://frontend/app/page.tsx#L1-L165)
- [(public)\courses\page.tsx](file://frontend/app/(public)/courses/page.tsx#L1-L97)

### State Management with Zustand Stores

#### Authentication Store
- Manages user, authentication state, loading, and errors.
- Provides actions for login, register, logout, fetchUser, and clearing errors.
- Persists selected parts of state to localStorage for session continuity.

```mermaid
classDiagram
class AuthState {
+User user
+boolean isAuthenticated
+boolean isLoading
+string error
+login(email, password) void
+register(email, password, name) void
+logout() void
+fetchUser() void
+clearError() void
}
class User {
+string id
+string email
+string name
+string avatar_url
}
AuthState --> User : "contains"
```

**Diagram sources**
- [authStore.ts:5-24](file://frontend/app/store/authStore.ts#L5-L24)
- [authStore.ts:26-98](file://frontend/app/store/authStore.ts#L26-L98)

**Section sources**
- [authStore.ts:1-98](file://frontend/app/store/authStore.ts#L1-L98)

#### Course Management Store
- Manages subjects, current subject/video context, enrollment state, and loading/error states.
- Provides actions to fetch subjects, fetch subject tree, fetch video, enroll, and clear error.

```mermaid
classDiagram
class CourseState {
+Subject[] subjects
+Subject currentSubject
+Video currentVideo
+Video nextVideo
+Video prevVideo
+boolean isEnrolled
+boolean isLoading
+string error
+fetchSubjects() void
+fetchSubjectTree(slug) void
+fetchVideo(id) void
+enroll(subjectId) void
+clearError() void
}
class Subject {
+string id
+string title
+string slug
+string description
+string thumbnail_url
+number total_duration_seconds
+Section[] sections
}
class Section {
+string id
+string title
+number order_index
+Video[] videos
}
class Video {
+string id
+string title
+string description
+string youtube_video_id
+number duration_seconds
+number order_index
}
CourseState --> Subject
Subject --> Section
Section --> Video
```

**Diagram sources**
- [courseStore.ts:20-46](file://frontend/app/store/courseStore.ts#L20-L46)
- [courseStore.ts:48-121](file://frontend/app/store/courseStore.ts#L48-L121)

**Section sources**
- [courseStore.ts:1-121](file://frontend/app/store/courseStore.ts#L1-L121)

#### AI Assistant Store
- Manages chat messages, panel open state, and loading/error states.
- Provides actions to send messages, summarize videos, generate quizzes, explain concepts, toggle panel, and clear messages/errors.

```mermaid
classDiagram
class AIState {
+ChatMessage[] messages
+boolean isLoading
+string error
+boolean isOpen
+sendMessage(message, context?) void
+summarizeVideo(videoId) string
+generateQuiz(videoId) QuizQuestion[]
+explainConcept(concept, videoId?) string
+togglePanel() void
+setIsOpen(isOpen) void
+clearMessages() void
+clearError() void
}
class ChatMessage {
+string id
+string role
+string content
+Date timestamp
+string[] suggestions
}
class QuizQuestion {
+string question
+string[] options
+number correctAnswer
}
AIState --> ChatMessage
AIState --> QuizQuestion
```

**Diagram sources**
- [aiStore.ts:4-33](file://frontend/app/store/aiStore.ts#L4-L33)
- [aiStore.ts:35-129](file://frontend/app/store/aiStore.ts#L35-L129)

**Section sources**
- [aiStore.ts:1-129](file://frontend/app/store/aiStore.ts#L1-L129)

### API Integration Patterns
- API client configuration and axios setup are located under app/lib. The API client exposes typed endpoints for auth, subjects, videos, and AI.
- Next.js rewrites forward /api/* to the backend API URL, enabling clean client-side calls.

```mermaid
sequenceDiagram
participant Page as "Courses Page"
participant Store as "courseStore.ts"
participant API as "api.ts"
participant Axios as "axios.ts"
participant Backend as "Backend /api/*"
Page->>Store : fetchSubjects()
Store->>API : subjectsApi.getAll()
API->>Axios : GET /api/subjects
Axios->>Backend : Proxyed request
Backend-->>Axios : JSON response
Axios-->>API : Parsed data
API-->>Store : Subjects array
Store-->>Page : Update state and render
```

**Diagram sources**
- [(public)\courses\page.tsx](file://frontend/app/(public)/courses/page.tsx#L1-L97)
- [courseStore.ts:58-69](file://frontend/app/store/courseStore.ts#L58-L69)
- [next.config.js:9-16](file://frontend/next.config.js#L9-L16)

**Section sources**
- [next.config.js:1-20](file://frontend/next.config.js#L1-L20)
- [courseStore.ts:1-121](file://frontend/app/store/courseStore.ts#L1-L121)

### Component Lifecycle and Reactivity
- Pages declare "use client" and use useEffect to trigger data fetching on mount.
- Stores update state immutably; components subscribe via hooks and re-render on state changes.
- Animations leverage Framer Motion for smooth transitions and viewport-driven triggers.

```mermaid
flowchart TD
Mount["Component Mount"] --> Effect["useEffect Hook"]
Effect --> StoreCall["Call Store Action"]
StoreCall --> APIReq["API Request"]
APIReq --> SetState["Set Store State"]
SetState --> Render["Re-render Components"]
```

**Diagram sources**
- [(public)\courses\page.tsx](file://frontend/app/(public)/courses/page.tsx#L12-L14)
- [courseStore.ts:58-69](file://frontend/app/store/courseStore.ts#L58-L69)

**Section sources**
- [(public)\courses\page.tsx](file://frontend/app/(public)/courses/page.tsx#L1-L97)
- [courseStore.ts:1-121](file://frontend/app/store/courseStore.ts#L1-L121)

## Dependency Analysis
External libraries and their roles:
- next, react, react-dom: Next.js runtime and rendering.
- framer-motion: Animation primitives for engaging UI.
- lucide-react: Icons for UI elements.
- next-themes: Theme provider for light/dark mode.
- axios: HTTP client for API requests.
- zustand: Lightweight state management.

```mermaid
graph LR
Next["next"] --> App["Application"]
React["react + react-dom"] --> App
FM["framer-motion"] --> UI["UI Components"]
Icons["lucide-react"] --> UI
Themes["next-themes"] --> UI
Axios["axios"] --> API["API Layer"]
Zustand["zustand"] --> Stores["Zustand Stores"]
App --> Stores
App --> API
```

**Diagram sources**
- [package.json:12-23](file://frontend/package.json#L12-L23)

**Section sources**
- [package.json:1-37](file://frontend/package.json#L1-L37)

## Performance Considerations
- Use of path aliases reduces bundle bloat and improves maintainability.
- Strict TypeScript compilation prevents runtime errors and enables better tree-shaking.
- Framer Motion animations are scoped to improve rendering performance.
- Zustand stores minimize re-renders by updating only changed slices.
- Next.js App Router with route groups helps structure code for better code splitting and lazy loading.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- API proxy misconfiguration: Verify NEXT_PUBLIC_API_URL and rewrites in next.config.js.
- Authentication redirects loop: Ensure auth store hydration occurs before layout navigation guards.
- Missing assets: Confirm image domains are whitelisted in next.config.js images configuration.
- Type errors: Run typecheck script and fix TS errors reported by strict compiler options.

**Section sources**
- [next.config.js:1-20](file://frontend/next.config.js#L1-L20)
- [(app)\layout.tsx](file://frontend/app/(app)/layout.tsx#L20-L28)
- [package.json:24-35](file://frontend/package.json#L24-L35)

## Conclusion
The frontend leverages Next.js App Router with route groups to cleanly separate public, authentication, and application areas. Zustand stores encapsulate domain-specific state for authentication, course management, and AI assistant interactions. API integration is streamlined via axios and Next.js rewrites. The architecture emphasizes component composition, reactive updates, and performance through careful state management and animation usage.

[No sources needed since this section summarizes without analyzing specific files]