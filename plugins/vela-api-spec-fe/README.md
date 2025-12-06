# 🚀 Vela API Spec Frontend Plugin

Frontend plugin untuk Vela API Spec Generator - menyediakan UI interface untuk generate dan validate API specifications untuk Dynamic Site Generator.

## ✨ Features

### Core Features

- 🎨 **Interactive UI** - Generate site configs, pages, dan components melalui user-friendly interface
- 📋 **Schema Viewer** - Browse dan explore component schemas
- ✅ **Validation** - Validate generated configurations secara real-time
- 📚 **Examples** - Load dan inspect complete example configurations
- 🔍 **Health Check** - Monitor backend plugin status

### 🤖 AI-Powered Features (NEW!)

- 🌟 **Natural Language Generation** - Describe website dalam bahasa natural
- 🏗️ **AI Site Config Generator** - Generate complete site dengan input terstruktur
- 📄 **AI Page Generator** - Create individual pages dengan AI
- 🧩 **AI Component Generator** - Generate components dengan realistic content
- ⚡ **Smart Validation** - Auto-validate AI generated configs
- 🎯 **Context-Aware** - AI memahami industry dan target audience

## 📦 Installation

Plugin ini sudah terintegrasi dalam Backstage app. Untuk menggunakannya:

1. Navigate ke `/vela-api-spec` di Backstage instance Anda
2. Mulai generate API specifications!

## 🎯 Usage

### 🤖 AI Generator (Recommended!)

#### Natural Language Prompt

1. Buka tab **"🤖 AI Generator"**
2. Pilih mode **"Natural Language Prompt"**
3. Ketik deskripsi website yang Anda inginkan:
   ```
   Create a modern SaaS landing page for project management tool.
   Include hero, features, pricing, testimonials, and contact form.
   ```
4. Klik **"✨ Generate with AI"**
5. Tunggu 10-30 detik
6. View hasil di Result Display

#### Complete Site Config

1. Pilih mode **"Complete Site Config"**
2. Isi form:
   - Site Name (required)
   - Site Description (required)
   - Industry (optional)
   - Target Audience (optional)
   - Style Preference (optional)
3. Klik **"✨ Generate with AI"**

#### Single Page

1. Pilih mode **"Single Page"**
2. Isi form:
   - Path (e.g., `/about`)
   - Title
   - Description (optional)
   - Purpose (optional)
3. Klik **"✨ Generate with AI"**

#### Single Component

1. Pilih mode **"Single Component"**
2. Pilih Component Type dari dropdown
3. Isi Context (optional)
4. Isi Content Requirements (optional)
5. Klik **"✨ Generate with AI"**

### 🏗️ Generate Site Configuration (Manual)

1. Go to "Generate Site Config" tab
2. Enter site name and description
3. Click "Generate" to create a full site configuration
4. Optionally click "Validate" to check the configuration

### 📄 Generate Page (Manual)

1. Go to "Generate Page" tab
2. Enter page path (e.g., `/about`)
3. Enter page title
4. Click "Generate Page"

### 🧩 Generate Component (Manual)

1. Go to "Generate Component" tab
2. Select component type from dropdown
3. Click "Generate Component"

### 📋 View Schema

1. Go to "View Schema" tab
2. Select component type
3. Click "Load Schema" to see the JSON schema

### 💡 Load Examples

1. Go to "Examples" tab
2. Choose "Minimal Landing Page" or "Portfolio Site"
3. Click "Load Example"

## Development

```bash
# Start the plugin in development mode
yarn start

# Run tests
yarn test

# Build the plugin
yarn build
```

## API Reference

The plugin uses the backend API at `/api/vela-api-spec`:

- `GET /health` - Health check
- `GET /templates/site-config` - Get site config template
- `GET /schemas/components` - Get all component schemas
- `GET /schemas/components/:type` - Get specific component schema
- `POST /generate/site-config` - Generate site configuration
- `POST /generate/page` - Generate page configuration
- `POST /generate/component/:type` - Generate component
- `POST /validate/site-config` - Validate site configuration
- `GET /examples/:type` - Get example configuration
