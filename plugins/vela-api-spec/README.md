# Vela API Spec Plugin

This plugin provides API specifications and templates for building Server-Driven UI (SDUI) applications based on the Dynamic Site Generator Protocol.

## Features

- **Component Schemas**: JSON schemas for all supported components (Hero, Features, Grid, Stats, etc.)
- **Site Configuration Templates**: Pre-built templates for common site types
- **Validation**: Validate site configurations against the schema
- **Examples**: Sample payloads for different use cases (minimal, portfolio, etc.)
- **Code Generation**: Generate components and pages programmatically
- **🆕 GitHub Integration**: Save and manage configs in GitHub repository
- **🤖 AI Generation**: Generate configs from natural language prompts

## API Endpoints

### Health Check

```
GET /api/vela-api-spec/health
```

### Get Site Configuration Template

```
GET /api/vela-api-spec/templates/site-config
```

### Get All Component Schemas

```
GET /api/vela-api-spec/schemas/components
```

### Get Specific Component Schema

```
GET /api/vela-api-spec/schemas/components/:type
```

Parameters:

- `type`: Component type (hero, features, grid, stats, team, testimonials, cta, contact, pricing, faq, blog, gallery, process, video, partners)

### Generate Site Configuration

```
POST /api/vela-api-spec/generate/site-config
```

Request body:

```json
{
  "input": {
    "site": {
      "title": "My Site",
      "description": "Site description"
    },
    "theme": {
      "primary": "#3b82f6",
      "background": "#ffffff",
      "text": "#1f2937",
      "mode": "light"
    }
  }
}
```

### Generate Page Configuration

```
POST /api/vela-api-spec/generate/page
```

Request body:

```json
{
  "path": "/",
  "title": "Home",
  "sections": [
    {
      "type": "hero",
      "content": {
        "title": "Welcome",
        "cta": {
          "text": "Get Started",
          "href": "/start"
        }
      }
    }
  ]
}
```

### Generate Component

```
POST /api/vela-api-spec/generate/component/:type
```

Parameters:

- `type`: Component type

Request body:

```json
{
  "content": {
    "title": "Component Title",
    ...
  }
}
```

### Validate Site Configuration

```
POST /api/vela-api-spec/validate/site-config
```

Request body:

```json
{
  "config": {
    "site": { ... },
    "theme": { ... },
    "pages": [ ... ]
  }
}
```

Response:

```json
{
  "valid": true,
  "errors": [],
  "warnings": []
}
```

### Get Example Payloads

```
GET /api/vela-api-spec/examples/:type
```

Parameters:

- `type`: Example type (minimal, portfolio)

## Component Types

The plugin supports the following component types:

1. **hero** - Hero sections with CTA
2. **features** - Feature lists with icons
3. **grid** - Project/portfolio grids
4. **stats** - Statistics/metrics display
5. **team** - Team member profiles
6. **testimonials** - Client testimonials
7. **cta** - Call-to-action sections
8. **contact** - Contact forms
9. **pricing** - Pricing tables
10. **faq** - FAQ sections
11. **blog** - Blog post listings
12. **gallery** - Image galleries
13. **process** - Step-by-step processes
14. **video** - Video embeds
15. **partners** - Partner/logo showcases

## Usage Examples

### Get Hero Component Schema

```bash
curl http://localhost:7007/api/vela-api-spec/schemas/components/hero
```

### Generate a Simple Site

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/generate/site-config \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "site": {
        "title": "My Portfolio",
        "description": "My awesome portfolio"
      },
      "theme": {
        "primary": "#f59e0b",
        "background": "#0f172a",
        "text": "#f1f5f9",
        "mode": "dark"
      }
    }
  }'
```

### 🤖 AI Examples

#### Generate Site Config with AI

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/ai/generate/site-config \
  -H "Content-Type: application/json" \
  -d '{
    "siteName": "TechFlow",
    "siteDescription": "Streamline your workflow with AI-powered tools",
    "industry": "SaaS",
    "targetAudience": "Developers and teams",
    "style": "Modern and clean"
  }'
```

#### Generate from Natural Language Prompt

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/ai/generate/from-prompt \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a landing page for an AI chatbot service with features, pricing, and demo section"
  }'
```

### Validate Configuration

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/validate/site-config \
  -H "Content-Type: application/json" \
  -d @site-config.json
```

## 🖥️ Frontend Plugin

Plugin ini juga memiliki frontend UI di:

- **Path**: `/vela-api-spec`
- **Features**:
  - 🤖 AI Generator tab (Natural Language, Site, Page, Component)
  - 🏗️ Generate Site Config tab
  - 📄 Generate Page tab
  - 🧩 Generate Component tab
  - 📋 View Schema tab
  - 💡 Examples tab

## ⚙️ Configuration

Add to your `app-config.yaml`:

```yaml
vela:
  openrouter:
    apiKey: ${OPENROUTER_API_KEY}
  jina:
    apiKey: ${JINA_API_KEY}
```

Create `.env` file:

```bash
OPENROUTER_API_KEY=your_api_key_here
JINA_API_KEY=your_jina_key_here
```

Get API keys:

- OpenRouter: https://openrouter.ai/keys
- Jina AI: https://jina.ai/

## Integration

To use this plugin in your Backstage backend:

```typescript
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// ... other plugins

backend.add(import('@internal/plugin-vela-api-spec'));

backend.start();
```

## Development

```bash
# Start the plugin in development mode
yarn start

# Run tests
yarn test

# Build the plugin
yarn build

# Lint
yarn lint
```

## 📚 Documentation

- **[🇮🇩 Setup GitHub](./docs/GITHUB_SETUP_ID.md)** - Panduan setup GitHub integration
- **[GitHub API Reference](./docs/GITHUB_INTEGRATION.md)** - Complete API documentation

## License

Apache-2.0
