# API Usage Guide

Complete guide for using the Vela API Spec plugin.

## Table of Contents

- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Component Types](#component-types)
- [Advanced Usage](#advanced-usage)
- [Best Practices](#best-practices)

## Getting Started

### Installation

The plugin is already integrated into the backend. After running `yarn install`, start the backend:

```bash
cd packages/backend
yarn start
```

The API will be available at: `http://localhost:7007/api/vela-api-spec`

### Quick Test

```bash
# Check if plugin is running
curl http://localhost:7007/api/vela-api-spec/health

# Get site config template
curl http://localhost:7007/api/vela-api-spec/templates/site-config
```

## API Endpoints

### 1. Health Check

**GET** `/api/vela-api-spec/health`

Check if the plugin is running.

```bash
curl http://localhost:7007/api/vela-api-spec/health
```

Response:

```json
{
  "status": "ok",
  "plugin": "vela-api-spec"
}
```

---

### 2. Get Site Configuration Template

**GET** `/api/vela-api-spec/templates/site-config`

Get a complete site configuration template.

```bash
curl http://localhost:7007/api/vela-api-spec/templates/site-config
```

Response: Complete site config JSON with all sections.

---

### 3. Get All Component Schemas

**GET** `/api/vela-api-spec/schemas/components`

Get schemas for all available components.

```bash
curl http://localhost:7007/api/vela-api-spec/schemas/components
```

Response:

```json
{
  "hero": {
    /* Hero schema */
  },
  "features": {
    /* Features schema */
  },
  "grid": {
    /* Grid schema */
  }
  // ... other components
}
```

---

### 4. Get Specific Component Schema

**GET** `/api/vela-api-spec/schemas/components/:type`

Get schema for a specific component type.

**Parameters:**

- `type` - Component type (hero, features, grid, stats, team, testimonials, cta, contact, pricing, faq, blog, gallery, process, video, partners)

```bash
# Get hero component schema
curl http://localhost:7007/api/vela-api-spec/schemas/components/hero

# Get features component schema
curl http://localhost:7007/api/vela-api-spec/schemas/components/features
```

Response:

```json
{
  "type": "object",
  "required": ["title", "cta"],
  "properties": {
    "title": { "type": "string", "description": "Main hero title" },
    "cta": {
      /* ... */
    }
  },
  "example": {
    /* ... */
  }
}
```

---

### 5. Generate Site Configuration

**POST** `/api/vela-api-spec/generate/site-config`

Generate a complete site configuration from partial input.

**Request Body:**

```json
{
  "input": {
    "site": {
      "title": "My Awesome Site",
      "description": "A site about awesome things"
    },
    "theme": {
      "primary": "#3b82f6",
      "secondary": "#8b5cf6",
      "background": "#ffffff",
      "text": "#1f2937",
      "mode": "light"
    },
    "pages": [
      {
        "path": "/",
        "sections": []
      }
    ]
  }
}
```

**Example:**

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/generate/site-config \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "site": {
        "title": "Tech Startup",
        "description": "Building the future"
      },
      "theme": {
        "primary": "#3b82f6",
        "background": "#ffffff",
        "text": "#1f2937",
        "mode": "light"
      }
    }
  }'
```

---

### 6. Generate Page Configuration

**POST** `/api/vela-api-spec/generate/page`

Generate a page configuration.

**Request Body:**

```json
{
  "path": "/about",
  "title": "About Us",
  "description": "Learn more about our company",
  "sections": [
    {
      "type": "hero",
      "content": {
        "title": "About Our Company",
        "cta": {
          "text": "Contact Us",
          "href": "/contact"
        }
      }
    }
  ]
}
```

**Example:**

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/generate/page \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/services",
    "title": "Our Services",
    "sections": [
      {
        "type": "hero",
        "content": {
          "title": "What We Offer",
          "cta": {"text": "Learn More", "href": "#features"}
        }
      }
    ]
  }'
```

---

### 7. Generate Component

**POST** `/api/vela-api-spec/generate/component/:type`

Generate a specific component.

**Parameters:**

- `type` - Component type

**Request Body:**

```json
{
  "content": {
    "title": "Component Title"
    // ... other component-specific fields
  }
}
```

**Example - Generate Hero:**

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/generate/component/hero \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "title": "Welcome to Our Platform",
      "subtitle": "Build amazing things",
      "cta": {
        "text": "Get Started",
        "href": "/signup",
        "variant": "primary"
      }
    }
  }'
```

**Example - Generate Features:**

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/generate/component/features \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "title": "Our Features",
      "layout": "grid",
      "columns": 3,
      "features": [
        {
          "title": "Fast",
          "description": "Lightning fast performance",
          "icon": "zap"
        },
        {
          "title": "Secure",
          "description": "Enterprise-grade security",
          "icon": "shield"
        }
      ]
    }
  }'
```

---

### 8. Validate Site Configuration

**POST** `/api/vela-api-spec/validate/site-config`

Validate a site configuration.

**Request Body:**

```json
{
  "config": {
    "site": {
      /* ... */
    },
    "theme": {
      /* ... */
    },
    "pages": [
      /* ... */
    ]
  }
}
```

**Example:**

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/validate/site-config \
  -H "Content-Type: application/json" \
  -d @examples/minimal-landing.json
```

**Response:**

```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    {
      "field": "navbar",
      "message": "Navbar configuration is recommended"
    }
  ]
}
```

---

### 9. Get Example Payloads

**GET** `/api/vela-api-spec/examples/:type`

Get example site configurations.

**Parameters:**

- `type` - Example type: `minimal` or `portfolio`

```bash
# Get minimal landing page example
curl http://localhost:7007/api/vela-api-spec/examples/minimal

# Get portfolio site example
curl http://localhost:7007/api/vela-api-spec/examples/portfolio
```

---

## Component Types

### Available Components

1. **hero** - Hero sections with CTA buttons
2. **features** - Feature grids with icons
3. **grid** - Project/portfolio grids
4. **stats** - Statistics and metrics
5. **team** - Team member profiles
6. **testimonials** - Client reviews
7. **cta** - Call-to-action sections
8. **contact** - Contact forms
9. **pricing** - Pricing tables
10. **faq** - FAQ sections
11. **blog** - Blog post listings
12. **gallery** - Image galleries
13. **process** - Step-by-step processes
14. **video** - Video embeds
15. **partners** - Partner logos

### Component Examples

See the [examples](./examples) directory for complete examples, or query individual schemas:

```bash
# Hero
curl http://localhost:7007/api/vela-api-spec/schemas/components/hero

# Features
curl http://localhost:7007/api/vela-api-spec/schemas/components/features

# Pricing
curl http://localhost:7007/api/vela-api-spec/schemas/components/pricing
```

---

## Advanced Usage

### Building a Complete Site Programmatically

```javascript
async function buildSite() {
  // 1. Generate base config
  const baseConfig = await fetch('/api/vela-api-spec/generate/site-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: {
        site: {
          title: 'My Site',
          description: 'My awesome site',
        },
        theme: {
          primary: '#3b82f6',
          background: '#ffffff',
          text: '#1f2937',
          mode: 'light',
        },
      },
    }),
  }).then(r => r.json());

  // 2. Generate hero component
  const hero = await fetch('/api/vela-api-spec/generate/component/hero', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: {
        title: 'Welcome',
        cta: { text: 'Get Started', href: '/start' },
      },
    }),
  }).then(r => r.json());

  // 3. Add component to page
  baseConfig.pages[0].sections.push(hero);

  // 4. Validate
  const validation = await fetch('/api/vela-api-spec/validate/site-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config: baseConfig }),
  }).then(r => r.json());

  if (validation.valid) {
    console.log('Site config is valid!');
    return baseConfig;
  } else {
    console.error('Validation errors:', validation.errors);
  }
}
```

### Fetching Multiple Schemas

```javascript
async function getAllComponentSchemas() {
  const response = await fetch('/api/vela-api-spec/schemas/components');
  const schemas = await response.json();

  // Now you have all schemas
  console.log('Available components:', Object.keys(schemas));

  return schemas;
}
```

### Dynamic Component Generation

```javascript
async function generateMultipleComponents(components) {
  const generated = await Promise.all(
    components.map(({ type, content }) =>
      fetch(`/api/vela-api-spec/generate/component/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      }).then(r => r.json()),
    ),
  );

  return generated;
}

// Usage
const components = await generateMultipleComponents([
  {
    type: 'hero',
    content: { title: 'Hello', cta: { text: 'Start', href: '/' } },
  },
  {
    type: 'features',
    content: { title: 'Features', features: [] },
  },
]);
```

---

## Best Practices

### 1. Always Validate

Always validate your configuration before using it:

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/validate/site-config \
  -H "Content-Type: application/json" \
  -d @your-config.json
```

### 2. Use Examples as Templates

Start with example configurations and modify them:

```bash
# Get example
curl http://localhost:7007/api/vela-api-spec/examples/minimal > my-site.json

# Edit my-site.json
# ...

# Validate
curl -X POST http://localhost:7007/api/vela-api-spec/validate/site-config \
  -H "Content-Type: application/json" \
  -d @my-site.json
```

### 3. Check Schemas First

Before creating components, check the schema to understand required fields:

```bash
curl http://localhost:7007/api/vela-api-spec/schemas/components/hero
```

### 4. Handle Optional Fields

Many fields are optional. Only include them if you need them:

```json
// ✅ Good - minimal
{
  "type": "hero",
  "content": {
    "title": "Welcome",
    "cta": { "text": "Start", "href": "/" }
  }
}

// ❌ Avoid - unnecessary fields
{
  "type": "hero",
  "content": {
    "title": "Welcome",
    "subtitle": "",
    "description": null,
    "cta": { "text": "Start", "href": "/" }
  }
}
```

### 5. Use Consistent Naming

Follow the naming conventions in the schema:

- `camelCase` for properties
- Consistent icon names (from Lucide or FontAwesome)
- Valid color hex codes for colors

---

## Troubleshooting

### Plugin Not Responding

```bash
# Check if backend is running
curl http://localhost:7007/api/vela-api-spec/health
```

### Validation Errors

Check the error messages carefully:

```json
{
  "valid": false,
  "errors": [
    {
      "field": "site.title",
      "message": "Site title is required"
    }
  ]
}
```

### Component Not Found

```bash
# List all available components
curl http://localhost:7007/api/vela-api-spec/schemas/components | jq 'keys'
```

---

## Support

For more information, see:

- Main documentation: [CONTEXT.md](../../../CONTEXT.md)
- Plugin README: [README.md](./README.md)
- Examples: [examples/](./examples/)
