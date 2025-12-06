# API Spec Examples

This directory contains example JSON payloads that demonstrate the API Spec format for different types of sites.

## Available Examples

### 1. minimal-landing.json

A complete minimal landing page with essential components:

- Hero section with CTA
- Partner logos
- Features grid
- Statistics
- Pricing table
- Testimonials
- Final CTA

**Best for:** SaaS products, simple business sites, product launches

### 2. portfolio-site.json

A rich portfolio website for creative agencies:

- Full-screen hero with video background
- Project showcase with filtering
- Team member profiles
- Client testimonials
- Process timeline
- Advanced footer with newsletter

**Best for:** Creative agencies, design studios, freelancers

## How to Use These Examples

### 1. View in Browser

```bash
# Start the backend
cd packages/backend
yarn start

# Then visit
http://localhost:7007/api/vela-api-spec/examples/minimal
http://localhost:7007/api/vela-api-spec/examples/portfolio
```

### 2. Use as Template

Copy and modify these examples for your own projects:

```bash
# Copy example
cp examples/minimal-landing.json my-site-config.json

# Edit with your content
# ...

# Validate
curl -X POST http://localhost:7007/api/vela-api-spec/validate/site-config \
  -H "Content-Type: application/json" \
  -d @my-site-config.json
```

### 3. Generate from Scratch

Use the API to build your configuration programmatically:

```javascript
// Generate base config
const response = await fetch('/api/vela-api-spec/generate/site-config', {
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
});

const config = await response.json();
```

## Customizing Examples

### Change Colors

Update the `theme` section:

```json
{
  "theme": {
    "primary": "#your-color",
    "secondary": "#your-color",
    "background": "#your-color",
    "text": "#your-color",
    "mode": "light"
  }
}
```

### Add/Remove Components

Modify the `pages[].sections` array:

```json
{
  "pages": [
    {
      "path": "/",
      "sections": [
        { "type": "hero", "content": { ... } },
        { "type": "features", "content": { ... } }
      ]
    }
  ]
}
```

### Change Layout

Most components support layout variants:

```json
{
  "type": "features",
  "content": {
    "layout": "grid", // or "list", "carousel"
    "columns": 3 // 2, 3, or 4
  }
}
```

## Validation

Before using your config, validate it:

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/validate/site-config \
  -H "Content-Type: application/json" \
  -d @your-config.json
```

Response:

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

## Component Reference

See the main CONTEXT.md for detailed component specifications, or query the API:

```bash
# Get all component schemas
curl http://localhost:7007/api/vela-api-spec/schemas/components

# Get specific component schema
curl http://localhost:7007/api/vela-api-spec/schemas/components/hero
```
