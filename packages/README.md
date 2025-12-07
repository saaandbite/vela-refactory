# The Packages Folder

This folder contains the core applications of the VELA platform, separated into frontend and backend packages.

## 📦 Packages Overview

- **`app`**: The frontend application built with React and Backstage. It serves the UI for the developer portal.
- **`backend`**: The backend application running on Node.js. It powers the API, plugins, and integrations.

---

## 🔧 Backend Package (`packages/backend`)

The backend is the central nervous system of the VELA platform. It orchestrates various plugins, handles API requests, and manages connections to external services (GitHub, Kubernetes, AI APIs).

### 📂 Directory Structure

```
packages/backend/
├── Dockerfile          # Docker configuration for building the backend image
├── knexfile.js         # Database configuration for Knex.js (PostgreSQL)
├── package.json        # Dependencies and scripts
├── src/
│   ├── index.ts        # Entry point: wires up all plugins and starts the server
│   └── types.ts        # Type definitions
└── migrations/         # Database migrations
    └── ..._chat_tables.js  # Migrations for VELA features
```

### 🔌 Key Plugins

The backend integrates several core Backstage plugins and custom VELA plugins:

- **Core Plugins**:
  - `catalog`: Manages the software catalog.
  - `scaffolder`: Handles software templates and scaffolding.
  - `techdocs`: Serves technical documentation.
  - `auth`: Manages authentication (GitHub, Guest).
  - `search`: Provides search functionality.
  - `kubernetes`: Integrates with Kubernetes clusters.
- **VELA Plugins**:
  - `@internal/plugin-vela-backend`: Backend logic for VELA Radar (Data Intelligence).
  - `@internal/plugin-vela-api-spec`: Backend for API Spec Generator.

### 🚀 Installation & Running

To run the backend locally, follow these steps:

#### 1. Install Dependencies

From the root of the repository:

```bash
yarn install
```

#### 2. Configuration

Ensure your `app-config.yaml` (or `app-config.local.yaml`) is configured with necessary secrets:

- Database connection (PostgreSQL)
- GitHub Token (`GITHUB_TOKEN`)
- Gemini API Key (`REACT_APP_GEMINI_API_KEY`)

#### 3. Start the Backend

Run the backend in development mode:

```bash
yarn workspace backend start
```

The server will start on **port 7007**.

#### 4. Database Migrations

If you have database changes or are setting up for the first time:

```bash
yarn workspace backend migrate
```

### 🐳 Docker Build

To build the backend Docker image for deployment:

```bash
# From the root directory
yarn workspace backend build-image
```

This uses the `Dockerfile` located in `packages/backend/Dockerfile`.
