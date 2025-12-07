# VELA Backstage Platform

**Domain:** [https://vibecode.hackathon.sev-2.com](https://vibecode.hackathon.sev-2.com)
**Demo** [https://jam.dev/c/d8cfb3cb-132a-4b03-9e7d-b3a6e1e2d2e8](https://jam.dev/c/d8cfb3cb-132a-4b03-9e7d-b3a6e1e2d2e8) | [https://jam.dev/c/feec6da0-4c1c-4cdb-9223-ed8e71c08bea](https://jam.dev/c/feec6da0-4c1c-4cdb-9223-ed8e71c08bea)

VELA is a comprehensive Internal Developer Portal (IDP) built on top of [Backstage](https://backstage.io). It integrates advanced AI capabilities, data analysis tools, and Server-Driven UI (SDUI) generation to streamline the development workflow.

## 🌟 Key Features

### 1. VELA Radar (Data Intelligence)

Located at `/vela`, this module provides powerful data analysis capabilities:

- **Web-to-Spec Scraper**: Extracts structured data from websites using Jina Reader API for specification generation.
- **CSV Analyzer (AI-Powered)**:
  - **AI Analysis**: Uses Google Gemini to analyze CSV data.
  - **Sentiment Analysis**: Classifies data into positive, negative, or neutral sentiments.
  - **Topic Clustering**: Identifies key themes and topics within the data.
  - **Interactive Dashboard**: Visualizes results with charts and metrics.
  - **Smart Parsing**: Handles large files efficiently using Web Workers.

### 2. VELA API Spec (SDUI Generator)

Located at `/vela-api-spec`, this module is the core of the "Text-to-Website" workflow. It allows users to generate full website configurations using AI and deploy them instantly.

- **AI-Powered Generation**: Transform natural language prompts into complete JSON site configurations.
- **Automated Git Ops**: Seamlessly pushes generated configurations to a connected GitHub repository.
- **Instant Deployment**: Triggers automated deployments (e.g., Vercel) upon saving.

## 🔄 Workflow: From AI Prompt to Live Website

This platform features a complete end-to-end flow that automates the creation and deployment of websites. Here is the step-by-step process:

### 1. Setup & Configuration

To enable the automated deployment flow, the system requires a GitHub Token with write access to the target repository.

- **Target Repository**: [https://github.com/CaturSetyono/templates.git](https://github.com/CaturSetyono/templates.git)
- **Live Deployment**: [https://templates-two-beta.vercel.app/](https://templates-two-beta.vercel.app/)

### 2. The Process Flow

1.  **Generate (AI)**:

    - User navigates to the **VELA API Spec** plugin.
    - Enters a natural language prompt (e.g., _"Create a modern landing page for a SaaS startup"_).
    - The AI generates a complete JSON configuration adhering to the SDUI schema.

2.  **Review & Edit**:

    - User reviews the generated configuration in the built-in JSON editor.
    - Real-time validation ensures the config matches the component schemas.

3.  **Save & Push (Automated)**:

    - User clicks the **"Save to GitHub"** button.
    - The backend uses the configured `GITHUB_TOKEN` to automatically commit and push the new JSON config to the `CaturSetyono/templates` repository.

4.  **Deploy (Vercel)**:
    - Vercel detects the new commit in the repository.
    - Automatically triggers a rebuild and deployment.
    - The updated website is live at [https://templates-two-beta.vercel.app/](https://templates-two-beta.vercel.app/) within minutes.

## 🏗️ Project Structure

The project follows a standard Backstage monorepo structure with custom plugins:

```
vela-refactory/
├── packages/
│   ├── app/                 # Main frontend application
│   └── backend/             # Main backend application
├── plugins/
│   ├── vela/                # Frontend for VELA Radar (Data Intelligence)
│   ├── vela-backend/        # Backend for VELA Radar
│   ├── vela-api-spec/       # Backend for API Spec Generator
│   └── vela-api-spec-fe/    # Frontend for API Spec Generator
├── kubernetes/              # K8s deployment configurations
└── examples/                # Example data and templates
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or v22)
- Yarn
- Docker (for containerization)
- Google Gemini API Key (for AI features)

### Installation

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd vela-refactory
    ```

2.  **Install dependencies**

    ```bash
    yarn install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory (or configure in `app-config.local.yaml`):
    ```bash
    REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
    GITHUB_TOKEN=your_github_token  # For GitHub integration features
    ```

### Running Locally

Start both frontend and backend:

```bash
yarn start
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:7007

## 🛠️ Configuration

### App Configuration

The main configuration is handled in `app-config.yaml`. For local development, you can override settings in `app-config.local.yaml`.

### Plugin Configuration

- **Vela Radar**: Requires `REACT_APP_GEMINI_API_KEY` for AI analysis.
- **Vela API Spec**: Requires GitHub authentication for saving configurations.

## 📦 Deployment

The project includes Kubernetes manifests in the `kubernetes/` directory for deployment.

**Live Demo**: [https://vibecode.hackathon.sev-2.com](https://vibecode.hackathon.sev-2.com)

### Build Docker Image

```bash
yarn build:backend
yarn build-image
```

### Deploy to Kubernetes

```bash
kubectl apply -f kubernetes/
```

## 📚 API Documentation

The backend exposes several API endpoints via the plugins:

- **Vela API Spec**:
  - `GET /api/vela-api-spec/health`: Health check
  - `POST /api/vela-api-spec/generate/site-config`: Generate config from prompt
  - `GET /api/vela-api-spec/schemas/components`: Get component schemas
  - `GET /api/vela-api-spec/templates/site-config`: Get site config templates

---

Powered by [Backstage](https://backstage.io)
