# Authentication System

<cite>
**Referenced Files in This Document**
- [backend/src/modules/auth/controller.ts](file://backend/src/modules/auth/controller.ts)
- [backend/src/modules/auth/service.ts](file://backend/src/modules/auth/service.ts)
- [backend/src/modules/auth/routes.ts](file://backend/src/modules/auth/routes.ts)
- [backend/src/middleware/auth.ts](file://backend/src/middleware/auth.ts)
- [backend/src/utils/jwt.ts](file://backend/src/utils/jwt.ts)
- [backend/src/utils/password.ts](file://backend/src/utils/password.ts)
- [backend/src/utils/validation.ts](file://backend/src/utils/validation.ts)
- [backend/src/config/database.ts](file://backend/src/config/database.ts)
- [backend/migrations/001_create_users.sql](file://backend/migrations/001_create_users.sql)
- [backend/migrations/007_create_refresh_tokens.sql](file://backend/migrations/007_create_refresh_tokens.sql)
- [backend/src/app.ts](file://backend/src/app.ts)
- [backend/src/server.ts](file://backend/src/server.ts)
- [frontend/app/(auth)/login/page.tsx](file://frontend/app/(auth)/login/page.tsx)
- [frontend/app/(auth)/register/page.tsx](file://frontend/app/(auth)/register/page.tsx)
- [frontend/app/store/authStore.ts](file://frontend/app/store/authStore.ts)
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
This document provides comprehensive documentation for the Authentication System, covering user registration and login, password hashing and validation, JWT token management (generation, validation, refresh token rotation), session management via HTTP-only cookies, and integration with protected routes. It also outlines middleware implementation, token storage strategies, security considerations, and practical authentication flows with error handling and best practices.

## Project Structure
The authentication system spans backend modules and frontend stores:
- Backend:
  - Routes define endpoints for registration, login, logout, refresh, and protected profile retrieval.
  - Controller handles request validation, orchestrates service calls, and manages cookie-based refresh tokens.
  - Service performs database operations, password verification, and token generation/revoke actions.
  - Utilities implement JWT signing/verification, password hashing/compare, and Zod-based input validation.
  - Middleware enforces bearer token authentication for protected routes.
  - Database configuration and migrations define schema for users and refresh tokens.
- Frontend:
  - Login and Registration pages capture user input and delegate to the auth store.
  - Auth store coordinates API calls, persists access tokens, and manages authentication state.

```mermaid
graph TB
subgraph "Frontend"
FE_Login["Login Page<br/>(frontend/app/(auth)/login/page.tsx)"]
FE_Register["Register Page<br/>(frontend/app/(auth)/register/page.tsx)"]
FE_Store["Auth Store<br/>(frontend/app/store/authStore.ts)"]
end
subgraph "Backend"
R["Auth Routes<br/>(backend/src/modules/auth/routes.ts)"]
C["Auth Controller<br/>(backend/src/modules/auth/controller.ts)"]
S["Auth Service<br/>(backend/src/modules/auth/service.ts)"]
MW["Auth Middleware<br/>(backend/src/middleware/auth.ts)"]
JWT["JWT Utils<br/>(backend/src/utils/jwt.ts)"]
PASS["Password Utils<br/>(backend/src/utils/password.ts)"]
VAL["Validation Utils<br/>(backend/src/utils/validation.ts)"]
DB["Database Config<br/>(backend/src/config/database.ts)"]
MIG_USERS["Users Migration<br/>(backend/migrations/001_create_users.sql)"]
MIG_RT["Refresh Tokens Migration<br/>(backend/migrations/007_create_refresh_tokens.sql)"]
end
FE_Login --> FE_Store
FE_Register --> FE_Store
FE_Store --> R
R --> C
C --> S
C --> JWT
S --> PASS
S --> DB
MW --> JWT
JWT --> DB
DB --> MIG_USERS
DB --> MIG_RT
```

**Diagram sources**
- [backend/src/modules/auth/routes.ts:1-15](file://backend/src/modules/auth/routes.ts#L1-L15)
- [backend/src/modules/auth/controller.ts:1-99](file://backend/src/modules/auth/controller.ts#L1-L99)
- [backend/src/modules/auth/service.ts:1-108](file://backend/src/modules/auth/service.ts#L1-L108)
- [backend/src/middleware/auth.ts:1-42](file://backend/src/middleware/auth.ts#L1-L42)
- [backend/src/utils/jwt.ts:1-78](file://backend/src/utils/jwt.ts#L1-L78)
- [backend/src/utils/password.ts:1-12](file://backend/src/utils/password.ts#L1-L12)
- [backend/src/utils/validation.ts:1-31](file://backend/src/utils/validation.ts#L1-L31)
- [backend/src/config/database.ts:1-53](file://backend/src/config/database.ts#L1-L53)
- [backend/migrations/001_create_users.sql:1-11](file://backend/migrations/001_create_users.sql#L1-L11)
- [backend/migrations/007_create_refresh_tokens.sql:1-13](file://backend/migrations/007_create_refresh_tokens.sql#L1-L13)
- [frontend/app/(auth)/login/page.tsx:1-140](file://frontend/app/(auth)/login/page.tsx#L1-L140)
- [frontend/app/(auth)/register/page.tsx:1-165](file://frontend/app/(auth)/register/page.tsx#L1-L165)
- [frontend/app/store/authStore.ts:1-98](file://frontend/app/store/authStore.ts#L1-L98)

**Section sources**
- [backend/src/app.ts:1-54](file://backend/src/app.ts#L1-L54)
- [backend/src/server.ts:1-32](file://backend/src/server.ts#L1-L32)

## Core Components
- Authentication Routes: Expose endpoints for registration, login, logout, refresh, and protected profile retrieval.
- Authentication Controller: Validates inputs, invokes service functions, sets HTTP-only refresh cookies, and returns access tokens.
- Authentication Service: Handles user creation, credential verification, token generation, and revocation.
- JWT Utilities: Manage access and refresh token lifecycle, including signing, verification, and database-backed revocation.
- Password Utilities: Hash and compare passwords using bcrypt.
- Validation Utilities: Enforce input constraints using Zod schemas.
- Database Layer: Provides query helpers and transaction support; migrations define users and refresh tokens tables.
- Authentication Middleware: Extracts Bearer token, verifies it, and attaches user payload to the request.
- Frontend Pages and Store: Capture credentials, call API endpoints, persist access tokens, and manage authentication state.

**Section sources**
- [backend/src/modules/auth/routes.ts:1-15](file://backend/src/modules/auth/routes.ts#L1-L15)
- [backend/src/modules/auth/controller.ts:1-99](file://backend/src/modules/auth/controller.ts#L1-L99)
- [backend/src/modules/auth/service.ts:1-108](file://backend/src/modules/auth/service.ts#L1-L108)
- [backend/src/utils/jwt.ts:1-78](file://backend/src/utils/jwt.ts#L1-L78)
- [backend/src/utils/password.ts:1-12](file://backend/src/utils/password.ts#L1-L12)
- [backend/src/utils/validation.ts:1-31](file://backend/src/utils/validation.ts#L1-L31)
- [backend/src/config/database.ts:1-53](file://backend/src/config/database.ts#L1-L53)
- [backend/src/middleware/auth.ts:1-42](file://backend/src/middleware/auth.ts#L1-L42)
- [frontend/app/(auth)/login/page.tsx:1-140](file://frontend/app/(auth)/login/page.tsx#L1-L140)
- [frontend/app/(auth)/register/page.tsx:1-165](file://frontend/app/(auth)/register/page.tsx#L1-L165)
- [frontend/app/store/authStore.ts:1-98](file://frontend/app/store/authStore.ts#L1-L98)

## Architecture Overview
The authentication system follows a layered architecture:
- Presentation Layer (Frontend): Renders forms and manages state.
- API Layer (Backend): Routes, controllers, and middleware handle requests.
- Domain Layer (Backend): Services encapsulate business logic.
- Infrastructure Layer (Backend): JWT utilities, password utilities, validation utilities, and database configuration.

```mermaid
graph TB
FE["Frontend Pages<br/>Login/Register"]
STORE["Auth Store<br/>localStorage access tokens"]
ROUTES["Auth Routes<br/>POST /register, /login, /logout, /refresh, GET /me"]
CTRL["Auth Controller<br/>Validation, cookie refresh token, token delivery"]
SRV["Auth Service<br/>DB ops, password compare, token gen/revoke"]
MW["Auth Middleware<br/>Bearer token verification"]
JWTU["JWT Utils<br/>sign/verify, DB revocation"]
PASSU["Password Utils<br/>bcrypt hash/compare"]
DB["Database Config<br/>pool, query/queryOne, transaction"]
SCHEMA["Migrations<br/>users, refresh_tokens"]
FE --> STORE
STORE --> ROUTES
ROUTES --> CTRL
CTRL --> SRV
CTRL --> JWTU
SRV --> PASSU
SRV --> DB
MW --> JWTU
JWTU --> DB
DB --> SCHEMA
```

**Diagram sources**
- [backend/src/modules/auth/routes.ts:1-15](file://backend/src/modules/auth/routes.ts#L1-L15)
- [backend/src/modules/auth/controller.ts:1-99](file://backend/src/modules/auth/controller.ts#L1-L99)
- [backend/src/modules/auth/service.ts:1-108](file://backend/src/modules/auth/service.ts#L1-L108)
- [backend/src/middleware/auth.ts:1-42](file://backend/src/middleware/auth.ts#L1-L42)
- [backend/src/utils/jwt.ts:1-78](file://backend/src/utils/jwt.ts#L1-L78)
- [backend/src/utils/password.ts:1-12](file://backend/src/utils/password.ts#L1-L12)
- [backend/src/config/database.ts:1-53](file://backend/src/config/database.ts#L1-L53)
- [backend/migrations/001_create_users.sql:1-11](file://backend/migrations/001_create_users.sql#L1-L11)
- [backend/migrations/007_create_refresh_tokens.sql:1-13](file://backend/migrations/007_create_refresh_tokens.sql#L1-L13)
- [frontend/app/store/authStore.ts:1-98](file://frontend/app/store/authStore.ts#L1-L98)

## Detailed Component Analysis

### User Registration Flow
- Input validation occurs before any server-side action.
- Password is hashed using bcrypt with a fixed number of salt rounds.
- A new user record is inserted, and related gamification data is initialized.
- On success, the client receives a 201 response with user details.

```mermaid
sequenceDiagram
participant FE as "Frontend Register Page"
participant Store as "Auth Store"
participant Route as "Auth Routes"
participant Ctrl as "Auth Controller"
participant Svc as "Auth Service"
participant Pass as "Password Utils"
participant DB as "Database"
FE->>Store : "Submit registration form"
Store->>Route : "POST /api/auth/register"
Route->>Ctrl : "register(req)"
Ctrl->>Ctrl : "Validate input"
Ctrl->>Svc : "createUser(validatedData)"
Svc->>Pass : "hashPassword(password)"
Pass-->>Svc : "hashedPassword"
Svc->>DB : "INSERT INTO users"
DB-->>Svc : "user created"
Svc-->>Ctrl : "user object"
Ctrl-->>Store : "201 Created + user"
Store-->>FE : "Navigate to login"
```

**Diagram sources**
- [frontend/app/(auth)/register/page.tsx:1-165](file://frontend/app/(auth)/register/page.tsx#L1-L165)
- [frontend/app/store/authStore.ts:1-98](file://frontend/app/store/authStore.ts#L1-L98)
- [backend/src/modules/auth/routes.ts:1-15](file://backend/src/modules/auth/routes.ts#L1-L15)
- [backend/src/modules/auth/controller.ts:1-99](file://backend/src/modules/auth/controller.ts#L1-L99)
- [backend/src/modules/auth/service.ts:1-108](file://backend/src/modules/auth/service.ts#L1-L108)
- [backend/src/utils/password.ts:1-12](file://backend/src/utils/password.ts#L1-L12)
- [backend/src/config/database.ts:1-53](file://backend/src/config/database.ts#L1-L53)

**Section sources**
- [backend/src/modules/auth/controller.ts:8-16](file://backend/src/modules/auth/controller.ts#L8-L16)
- [backend/src/modules/auth/service.ts:13-48](file://backend/src/modules/auth/service.ts#L13-L48)
- [backend/src/utils/validation.ts:3-7](file://backend/src/utils/validation.ts#L3-L7)
- [backend/src/utils/password.ts:5-7](file://backend/src/utils/password.ts#L5-L7)

### User Login Flow
- Input validation ensures presence of email and password.
- User lookup retrieves the user record and password hash.
- Password comparison validates credentials.
- Access and refresh tokens are generated and returned.
- Refresh token is stored as an HTTP-only cookie with security attributes.
- Access token is returned in the JSON body for immediate use by the frontend.

```mermaid
sequenceDiagram
participant FE as "Frontend Login Page"
participant Store as "Auth Store"
participant Route as "Auth Routes"
participant Ctrl as "Auth Controller"
participant Svc as "Auth Service"
participant JWT as "JWT Utils"
participant DB as "Database"
FE->>Store : "Submit login form"
Store->>Route : "POST /api/auth/login"
Route->>Ctrl : "login(req)"
Ctrl->>Ctrl : "Validate input"
Ctrl->>Svc : "authenticateUser(validatedData)"
Svc->>DB : "SELECT user by email"
DB-->>Svc : "user with password_hash"
Svc->>Svc : "comparePassword(input, hash)"
Svc->>JWT : "generateTokens({userId,email})"
JWT->>DB : "INSERT refresh_tokens (token_hash, expires_at)"
DB-->>JWT : "ok"
JWT-->>Svc : "{accessToken, refreshToken}"
Svc-->>Ctrl : "{user, tokens}"
Ctrl->>Ctrl : "Set HTTP-only refreshToken cookie"
Ctrl-->>Store : "{message,user,accessToken}"
Store-->>FE : "Persist accessToken, navigate to dashboard"
```

**Diagram sources**
- [frontend/app/(auth)/login/page.tsx:1-140](file://frontend/app/(auth)/login/page.tsx#L1-L140)
- [frontend/app/store/authStore.ts:1-98](file://frontend/app/store/authStore.ts#L1-L98)
- [backend/src/modules/auth/routes.ts:1-15](file://backend/src/modules/auth/routes.ts#L1-L15)
- [backend/src/modules/auth/controller.ts:18-35](file://backend/src/modules/auth/controller.ts#L18-L35)
- [backend/src/modules/auth/service.ts:50-81](file://backend/src/modules/auth/service.ts#L50-L81)
- [backend/src/utils/jwt.ts:20-41](file://backend/src/utils/jwt.ts#L20-L41)
- [backend/src/config/database.ts:1-53](file://backend/src/config/database.ts#L1-L53)

**Section sources**
- [backend/src/modules/auth/controller.ts:18-35](file://backend/src/modules/auth/controller.ts#L18-L35)
- [backend/src/modules/auth/service.ts:50-81](file://backend/src/modules/auth/service.ts#L50-L81)
- [backend/src/utils/validation.ts:9-12](file://backend/src/utils/validation.ts#L9-L12)
- [backend/src/utils/password.ts:9-11](file://backend/src/utils/password.ts#L9-L11)

### Access Token Validation Middleware
- Extracts Authorization header and verifies Bearer token.
- On success, attaches decoded user payload to the request object.
- On failure, responds with 401 Unauthorized.

```mermaid
flowchart TD
Start(["Incoming Request"]) --> CheckHeader["Check Authorization Header"]
CheckHeader --> HasBearer{"Has 'Bearer ' prefix?"}
HasBearer --> |No| Respond401a["Respond 401: Access token required"]
HasBearer --> |Yes| ExtractToken["Extract Token"]
ExtractToken --> Verify["Verify Access Token"]
Verify --> Valid{"Verification OK?"}
Valid --> |No| Respond401b["Respond 401: Invalid or expired token"]
Valid --> |Yes| AttachUser["Attach user payload to req"]
AttachUser --> Next["Call next()"]
Respond401a --> End(["End"])
Respond401b --> End
Next --> End
```

**Diagram sources**
- [backend/src/middleware/auth.ts:8-24](file://backend/src/middleware/auth.ts#L8-L24)

**Section sources**
- [backend/src/middleware/auth.ts:8-24](file://backend/src/middleware/auth.ts#L8-L24)

### Refresh Token Rotation and Revocation
- Access tokens are short-lived; refresh tokens are long-lived and stored as hashes in the database.
- On login, a refresh token is generated and persisted with an expiration date.
- On refresh, the server verifies the refresh token against the stored hash, checks revocation and expiry, generates new tokens, and rotates the refresh cookie.
- Logout revokes the current refresh token; logout-all revokes all tokens for the user.

```mermaid
sequenceDiagram
participant FE as "Frontend"
participant Store as "Auth Store"
participant Route as "Auth Routes"
participant Ctrl as "Auth Controller"
participant JWT as "JWT Utils"
participant DB as "Database"
Note over FE,DB : "Login flow creates refresh token"
FE->>Store : "login()"
Store->>Route : "POST /api/auth/login"
Route->>Ctrl : "login(req)"
Ctrl->>JWT : "generateTokens(payload)"
JWT->>DB : "INSERT refresh_tokens (token_hash, expires_at)"
DB-->>JWT : "ok"
JWT-->>Ctrl : "{accessToken, refreshToken}"
Ctrl->>Ctrl : "Set HTTP-only refreshToken cookie"
Note over FE,DB : "Refresh flow"
FE->>Store : "refresh()"
Store->>Route : "POST /api/auth/refresh"
Route->>Ctrl : "refresh(req)"
Ctrl->>JWT : "verifyRefreshToken(refreshToken)"
JWT->>DB : "SELECT token_hash NOT revoked AND NOT expired"
DB-->>JWT : "valid token"
JWT-->>Ctrl : "payload"
Ctrl->>JWT : "generateTokens(payload)"
JWT-->>Ctrl : "{accessToken, refreshToken}"
Ctrl->>Ctrl : "Set new HTTP-only refreshToken cookie"
Note over FE,DB : "Logout flows"
FE->>Store : "logout()"
Store->>Route : "POST /api/auth/logout"
Route->>Ctrl : "logout(req)"
Ctrl->>JWT : "revokeRefreshToken(refreshToken)"
JWT->>DB : "UPDATE refresh_tokens SET revoked_at=NOW()"
DB-->>JWT : "ok"
Ctrl->>Ctrl : "Clear refreshToken cookie"
FE->>Store : "logoutAll()"
Store->>Route : "POST /api/auth/logout-all"
Route->>Ctrl : "logoutAll(req)"
Ctrl->>JWT : "revokeAllUserTokens(userId)"
JWT->>DB : "UPDATE refresh_tokens SET revoked_at=NOW() WHERE user_id=?"
DB-->>JWT : "ok"
Ctrl->>Ctrl : "Clear refreshToken cookie"
```

**Diagram sources**
- [backend/src/modules/auth/controller.ts:37-70](file://backend/src/modules/auth/controller.ts#L37-L70)
- [backend/src/utils/jwt.ts:47-77](file://backend/src/utils/jwt.ts#L47-L77)
- [backend/src/config/database.ts:1-53](file://backend/src/config/database.ts#L1-L53)

**Section sources**
- [backend/src/utils/jwt.ts:20-41](file://backend/src/utils/jwt.ts#L20-L41)
- [backend/src/utils/jwt.ts:47-77](file://backend/src/utils/jwt.ts#L47-L77)
- [backend/src/modules/auth/controller.ts:37-70](file://backend/src/modules/auth/controller.ts#L37-L70)

### Protected Route Access
- The authentication middleware protects routes by requiring a valid access token.
- Optional authentication middleware allows requests to proceed without a user when the token is absent or invalid.

```mermaid
flowchart TD
A["Request to /api/auth/me"] --> B["Auth Middleware"]
B --> C{"Has valid Bearer token?"}
C --> |Yes| D["Attach user payload and call next()"]
C --> |No| E["Respond 401 Unauthorized"]
D --> F["Controller: me()"]
F --> G["Return user data"]
```

**Diagram sources**
- [backend/src/modules/auth/routes.ts:11](file://backend/src/modules/auth/routes.ts#L11)
- [backend/src/middleware/auth.ts:8-24](file://backend/src/middleware/auth.ts#L8-L24)

**Section sources**
- [backend/src/modules/auth/routes.ts:11](file://backend/src/modules/auth/routes.ts#L11)
- [backend/src/middleware/auth.ts:26-41](file://backend/src/middleware/auth.ts#L26-L41)

### Frontend Integration and Token Storage
- The frontend store persists the access token in localStorage after successful login.
- It clears the access token on logout and handles token refresh errors by removing stale tokens.
- The store fetches the current user using the stored access token and handles token expiration by clearing state.

```mermaid
flowchart TD
StartFE(["Login/Register Page"]) --> Submit["Submit Form"]
Submit --> CallAPI["Auth Store calls API"]
CallAPI --> Success{"Success?"}
Success --> |Yes| SaveToken["localStorage.setItem('accessToken', token)"]
Success --> |No| ShowError["Set error message"]
SaveToken --> Navigate["Navigate to dashboard"]
CallAPI --> Logout["Logout"]
Logout --> RemoveToken["localStorage.removeItem('accessToken')"]
RemoveToken --> ResetState["Reset auth state"]
```

**Diagram sources**
- [frontend/app/store/authStore.ts:34-88](file://frontend/app/store/authStore.ts#L34-L88)
- [frontend/app/(auth)/login/page.tsx:24-34](file://frontend/app/(auth)/login/page.tsx#L24-L34)
- [frontend/app/(auth)/register/page.tsx:25-35](file://frontend/app/(auth)/register/page.tsx#L25-L35)

**Section sources**
- [frontend/app/store/authStore.ts:34-88](file://frontend/app/store/authStore.ts#L34-L88)
- [frontend/app/(auth)/login/page.tsx:24-34](file://frontend/app/(auth)/login/page.tsx#L24-L34)
- [frontend/app/(auth)/register/page.tsx:25-35](file://frontend/app/(auth)/register/page.tsx#L25-L35)

## Dependency Analysis
- Routes depend on Controller.
- Controller depends on Service, Validation, and JWT utilities.
- Service depends on Password utilities and Database.
- JWT utilities depend on Database and environment variables.
- Middleware depends on JWT utilities.
- Frontend store depends on API and localStorage.

```mermaid
graph LR
Routes["Auth Routes"] --> Controller["Auth Controller"]
Controller --> Service["Auth Service"]
Controller --> JWTU["JWT Utils"]
Controller --> Validation["Validation Utils"]
Service --> Password["Password Utils"]
Service --> DB["Database"]
JWTU --> DB
Middleware["Auth Middleware"] --> JWTU
FEStore["Auth Store"] --> Routes
```

**Diagram sources**
- [backend/src/modules/auth/routes.ts:1-15](file://backend/src/modules/auth/routes.ts#L1-L15)
- [backend/src/modules/auth/controller.ts:1-99](file://backend/src/modules/auth/controller.ts#L1-L99)
- [backend/src/modules/auth/service.ts:1-108](file://backend/src/modules/auth/service.ts#L1-L108)
- [backend/src/utils/jwt.ts:1-78](file://backend/src/utils/jwt.ts#L1-L78)
- [backend/src/utils/password.ts:1-12](file://backend/src/utils/password.ts#L1-L12)
- [backend/src/utils/validation.ts:1-31](file://backend/src/utils/validation.ts#L1-L31)
- [backend/src/config/database.ts:1-53](file://backend/src/config/database.ts#L1-L53)
- [backend/src/middleware/auth.ts:1-42](file://backend/src/middleware/auth.ts#L1-L42)
- [frontend/app/store/authStore.ts:1-98](file://frontend/app/store/authStore.ts#L1-L98)

**Section sources**
- [backend/src/modules/auth/controller.ts:1-99](file://backend/src/modules/auth/controller.ts#L1-L99)
- [backend/src/modules/auth/service.ts:1-108](file://backend/src/modules/auth/service.ts#L1-L108)
- [backend/src/utils/jwt.ts:1-78](file://backend/src/utils/jwt.ts#L1-L78)
- [backend/src/utils/password.ts:1-12](file://backend/src/utils/password.ts#L1-L12)
- [backend/src/utils/validation.ts:1-31](file://backend/src/utils/validation.ts#L1-L31)
- [backend/src/config/database.ts:1-53](file://backend/src/config/database.ts#L1-L53)
- [backend/src/middleware/auth.ts:1-42](file://backend/src/middleware/auth.ts#L1-L42)
- [frontend/app/store/authStore.ts:1-98](file://frontend/app/store/authStore.ts#L1-L98)

## Performance Considerations
- Rate limiting is applied to authentication endpoints to mitigate brute force attacks.
- Database queries leverage prepared statements and indexes on email and refresh token hash.
- Token generation and verification are lightweight; avoid excessive refresh cycles.
- Keep-alive connections and connection pooling reduce overhead.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Invalid credentials during login:
  - Ensure email and password meet validation requirements.
  - Confirm the user exists and the password hash matches.
- Missing or invalid access token:
  - Verify the Authorization header format and token validity.
  - Clear browser cookies/localStorage and re-authenticate.
- Refresh token errors:
  - Confirm the refresh token is present and not revoked/expired.
  - Rotate tokens on successful refresh and ensure cookie settings match environment.
- Database connectivity:
  - Check environment variables and connection pool configuration.
- CORS and cookies:
  - Ensure credentials are enabled and origins match between frontend and backend.

**Section sources**
- [backend/src/modules/auth/service.ts:61-68](file://backend/src/modules/auth/service.ts#L61-L68)
- [backend/src/middleware/auth.ts:12-23](file://backend/src/middleware/auth.ts#L12-L23)
- [backend/src/utils/jwt.ts:57-62](file://backend/src/utils/jwt.ts#L57-L62)
- [backend/src/app.ts:15-20](file://backend/src/app.ts#L15-L20)

## Conclusion
The Authentication System integrates robust input validation, secure password handling, and a resilient JWT-based token strategy with refresh token rotation and revocation. HTTP-only cookies protect refresh tokens, while access tokens are managed client-side. Middleware secures protected routes, and frontend state management streamlines user sessions. Together, these components deliver a secure, maintainable, and scalable authentication solution.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### Database Schema Overview
- Users table stores unique emails, password hashes, and metadata.
- Refresh tokens table stores hashed refresh tokens, user associations, expiration, and revocation timestamps.

```mermaid
erDiagram
USERS {
varchar id PK
varchar email UK
varchar password_hash
varchar name
varchar avatar_url
timestamp created_at
timestamp updated_at
}
REFRESH_TOKENS {
varchar id PK
varchar user_id FK
varchar token_hash
timestamp expires_at
timestamp revoked_at
timestamp created_at
}
USERS ||--o{ REFRESH_TOKENS : "has many"
```

**Diagram sources**
- [backend/migrations/001_create_users.sql:1-11](file://backend/migrations/001_create_users.sql#L1-L11)
- [backend/migrations/007_create_refresh_tokens.sql:1-13](file://backend/migrations/007_create_refresh_tokens.sql#L1-L13)

### Environment Variables
- JWT_SECRET: Secret key for signing tokens.
- JWT_EXPIRES_IN: Access token TTL.
- JWT_REFRESH_EXPIRES_IN: Refresh token TTL.
- NODE_ENV: Controls cookie security flags (secure).
- FRONTEND_URL: CORS origin for credentials.

**Section sources**
- [backend/src/utils/jwt.ts:6-8](file://backend/src/utils/jwt.ts#L6-L8)
- [backend/src/app.ts:15-20](file://backend/src/app.ts#L15-L20)
- [backend/src/modules/auth/controller.ts:22-28](file://backend/src/modules/auth/controller.ts#L22-L28)
- [backend/src/modules/auth/controller.ts:59-65](file://backend/src/modules/auth/controller.ts#L59-L65)