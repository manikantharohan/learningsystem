# Getting Started

<cite>
**Referenced Files in This Document**
- [package.json](file://package.json)
- [backend/package.json](file://backend/package.json)
- [frontend/package.json](file://frontend/package.json)
- [backend/src/config/database.ts](file://backend/src/config/database.ts)
- [backend/src/server.ts](file://backend/src/server.ts)
- [backend/src/app.ts](file://backend/src/app.ts)
- [backend/src/scripts/migrate.ts](file://backend/src/scripts/migrate.ts)
- [backend/src/scripts/seed.ts](file://backend/src/scripts/seed.ts)
- [backend/Dockerfile](file://backend/Dockerfile)
- [backend/render.yaml](file://backend/render.yaml)
- [frontend/next.config.js](file://frontend/next.config.js)
- [backend/tsconfig.json](file://backend/tsconfig.json)
- [backend/src/routes/index.ts](file://backend/src/routes/index.ts)
- [backend/src/modules/auth/controller.ts](file://backend/src/modules/auth/controller.ts)
- [backend/src/modules/auth/service.ts](file://backend/src/modules/auth/service.ts)
- [backend/src/middleware/auth.ts](file://backend/src/middleware/auth.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Setup](#environment-setup)
5. [Database Configuration and Migration](#database-configuration-and-migration)
6. [Local Development Setup](#local-development-setup)
7. [Initial Project Structure Walkthrough](#initial-project-structure-walkthrough)
8. [Development Server Startup](#development-server-startup)
9. [Database Seeding](#database-seeding)
10. [Basic Functionality Verification](#basic-functionality-verification)
11. [Troubleshooting Guide](#troubleshooting-guide)
12. [Environment Configuration Best Practices](#environment-configuration-best-practices)
13. [Conclusion](#conclusion)

## Introduction
This guide helps you set up and run the Learning Management System locally. It covers prerequisites, installation steps, environment configuration, database setup, development workflow, and troubleshooting. The project consists of a Node.js/Express backend with TypeScript, a MySQL database, and a Next.js frontend.

## Prerequisites
Ensure the following tools are installed on your machine:
- Node.js (version managed by the project)
- MySQL (compatible with the project's schema)
- Docker (optional, for containerized deployment)

These tools are required to build, run, and optionally deploy the system.

**Section sources**
- [backend/package.json:15-27](file://backend/package.json#L15-L27)
- [frontend/package.json:12-23](file://frontend/package.json#L12-L23)

## Installation
Follow these steps to install the project locally:

1. Clone the repository to your machine.
2. Install dependencies for the monorepo root, backend, and frontend:
   - Run the combined install script to install all packages at once.
   - Alternatively, install each package individually:
     - Root: install dependencies
     - Backend: install dependencies
     - Frontend: install dependencies

3. Build the backend TypeScript sources to generate JavaScript artifacts.

After installation, you can proceed to environment configuration and database setup.

**Section sources**
- [package.json:7-14](file://package.json#L7-L14)
- [backend/package.json:15-42](file://backend/package.json#L15-L42)
- [frontend/package.json:12-35](file://frontend/package.json#L12-L35)

## Environment Setup
Configure environment variables for both backend and frontend:

Backend environment variables:
- Database connection: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- Application: PORT, NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, FRONTEND_URL

Frontend environment variables:
- NEXT_PUBLIC_API_URL (used by Next.js rewrites to proxy API calls to the backend)

Notes:
- The backend loads environment variables via a configuration module and uses defaults when variables are missing.
- The frontend rewrites API requests from the frontend to the backend using NEXT_PUBLIC_API_URL.

**Section sources**
- [backend/src/config/database.ts:6-17](file://backend/src/config/database.ts#L6-L17)
- [backend/src/server.ts:6](file://backend/src/server.ts#L6)
- [backend/src/app.ts:15-20](file://backend/src/app.ts#L15-L20)
- [backend/render.yaml:7-29](file://backend/render.yaml#L7-L29)
- [frontend/next.config.js:9-16](file://frontend/next.config.js#L9-L16)

## Database Configuration and Migration
The backend connects to MySQL using a configured connection pool. Migrations are applied using a dedicated script that reads SQL files from the migrations directory and executes them sequentially.

Steps:
1. Ensure MySQL is running and accessible with the credentials provided via environment variables.
2. Apply migrations using the provided script.
3. Verify that all migration files were executed successfully.

The migration script reads SQL files from the migrations directory, splits statements by semicolons, and executes them against the configured database pool.

**Section sources**
- [backend/src/config/database.ts:19-50](file://backend/src/config/database.ts#L19-L50)
- [backend/src/scripts/migrate.ts:5-37](file://backend/src/scripts/migrate.ts#L5-L37)

## Local Development Setup
The project supports concurrent development of backend and frontend using a top-level script that runs both servers simultaneously. This requires the concurrently dependency at the root level.

To start development:
- Use the root script that launches the backend and frontend concurrently.
- The backend starts in development mode with automatic restarts.
- The frontend starts in development mode on its default port.

This setup streamlines local iteration across both services.

**Section sources**
- [package.json:8](file://package.json#L8)
- [backend/package.json:7](file://backend/package.json#L7)
- [frontend/package.json:6](file://frontend/package.json#L6)

## Initial Project Structure Walkthrough
The repository follows a monorepo layout with separate backend and frontend directories. Key highlights:
- Backend: Express server, TypeScript configuration, database configuration, middleware, modules, routes, and scripts for migrations and seeding.
- Frontend: Next.js application with routing, stores, components, and configuration for image domains and API rewrites.
- Root: Scripts to coordinate installation, development, building, and database tasks across both services.

This structure enables independent scaling and development of frontend and backend while sharing common tooling.

**Section sources**
- [backend/tsconfig.json:22-28](file://backend/tsconfig.json#L22-L28)
- [backend/src/routes/index.ts:1-25](file://backend/src/routes/index.ts#L1-L25)
- [frontend/next.config.js:6-16](file://frontend/next.config.js#L6-L16)

## Development Server Startup
Start the development servers using the root script that runs backend and frontend concurrently. This ensures both services are available during local development.

Commands:
- Start both services concurrently
- Start backend in development mode
- Start frontend in development mode

Verification:
- Confirm the backend logs indicate it is listening on the configured port.
- Confirm the frontend is accessible on its development port.

**Section sources**
- [package.json:8](file://package.json#L8)
- [backend/src/server.ts:8-18](file://backend/src/server.ts#L8-L18)
- [frontend/package.json:6](file://frontend/package.json#L6)

## Database Seeding
Seed the database with initial data using the provided script. This creates a demo user, a sample subject, related sections and videos, and gamification achievements.

Steps:
1. Ensure migrations have been applied so all tables exist.
2. Run the seed script to insert default records.
3. Verify that the demo user and sample content are present in the database.

The seed script inserts a predefined user, a subject with associated sections and videos, and achievement definitions for gamification.

**Section sources**
- [backend/src/scripts/seed.ts:4-107](file://backend/src/scripts/seed.ts#L4-L107)

## Basic Functionality Verification
Verify core functionality after setup:

1. Health check endpoint:
   - Access the health route to confirm the backend is reachable.

2. Authentication flow:
   - Register a user via the auth module.
   - Log in and receive tokens.
   - Use the refresh endpoint to obtain new access tokens.
   - Retrieve current user profile.

3. Frontend integration:
   - Confirm API rewrites are forwarding requests to the backend.
   - Navigate to frontend pages and verify data loading.

These checks validate that the database, backend routes, authentication, and frontend integration are working together.

**Section sources**
- [backend/src/routes/index.ts:11-14](file://backend/src/routes/index.ts#L11-L14)
- [backend/src/modules/auth/controller.ts:8-99](file://backend/src/modules/auth/controller.ts#L8-L99)
- [backend/src/modules/auth/service.ts:13-108](file://backend/src/modules/auth/service.ts#L13-L108)
- [backend/src/middleware/auth.ts:8-42](file://backend/src/middleware/auth.ts#L8-L42)
- [frontend/next.config.js:9-16](file://frontend/next.config.js#L9-L16)

## Troubleshooting Guide
Common setup issues and resolutions:

- Database connectivity errors:
  - Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME match your MySQL instance.
  - Ensure the database server is running and accessible from your machine.

- Port conflicts:
  - Change the backend PORT environment variable if the default port is in use.
  - Ensure the frontend development port is free.

- CORS or API proxy issues:
  - Confirm FRONTEND_URL matches the frontend origin.
  - Verify NEXT_PUBLIC_API_URL points to the backend server for API rewrites.

- Migration failures:
  - Check that all migration files are present and readable.
  - Ensure the target database exists and is writable.

- Authentication token problems:
  - Verify JWT_SECRET is set and consistent across deployments.
  - Confirm refresh tokens are being stored and sent via cookies.

- Docker build issues:
  - Ensure the Dockerfile installs production dependencies and builds TypeScript before starting the server.

**Section sources**
- [backend/src/config/database.ts:6-17](file://backend/src/config/database.ts#L6-L17)
- [backend/src/server.ts:6](file://backend/src/server.ts#L6)
- [backend/src/app.ts:15-20](file://backend/src/app.ts#L15-L20)
- [backend/render.yaml:10-29](file://backend/render.yaml#L10-L29)
- [backend/src/scripts/migrate.ts:31-34](file://backend/src/scripts/migrate.ts#L31-L34)
- [backend/Dockerfile:9-21](file://backend/Dockerfile#L9-L21)

## Environment Configuration Best Practices
- Keep secrets out of version control:
  - Use environment variables for sensitive values like JWT_SECRET, database credentials, and API keys.
- Use distinct environment files:
  - Maintain separate configurations for development, staging, and production.
- Validate environment variables:
  - Add runtime checks to ensure required variables are present and valid.
- Secure cookies:
  - Enable secure cookies in production and configure appropriate SameSite and HttpOnly flags.
- CORS alignment:
  - Align FRONTEND_URL with the actual frontend origin to avoid cross-origin issues.
- Database pooling:
  - Tune connection limits and timeouts based on expected load.

**Section sources**
- [backend/src/config/database.ts:12-17](file://backend/src/config/database.ts#L12-L17)
- [backend/src/app.ts:15-20](file://backend/src/app.ts#L15-L20)
- [backend/src/modules/auth/controller.ts:22-28](file://backend/src/modules/auth/controller.ts#L22-L28)
- [backend/render.yaml:7-29](file://backend/render.yaml#L7-L29)

## Conclusion
You now have the fundamentals to run the Learning Management System locally, configure environments, apply database migrations, seed data, and verify core functionality. Use the troubleshooting guide for common issues and follow best practices for environment configuration to maintain a secure and reliable setup.