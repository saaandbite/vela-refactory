# 🤖 AI-Powered API Spec Generator

Plugin vela-api-spec kini dilengkapi dengan kemampuan AI untuk menghasilkan konfigurasi site, pages, dan components secara otomatis menggunakan OpenRouter API dengan **Multiple Model Fallback**.

## ⚡ Multi-Model Architecture

Sistem menggunakan **3 AI models secara parallel** dengan mekanisme fallback otomatis:

1. **amazon/nova-2-lite-v1:free** - Fast & reliable
2. **kwaipilot/kat-coder-pro:free** - Coding specialist
3. **openai/gpt-oss-120b:free** - General purpose

### 🔄 Cara Kerja:

- Semua 3 model berjalan **bersamaan** (parallel execution)
- Sistem mengambil **hasil pertama yang berhasil**
- Jika ada model yang error, **otomatis fallback** ke model lain
- Lebih **cepat** dan **reliable** dibanding single model

### ✅ Keuntungan:

- **Higher Success Rate** - Jika satu model down/error, ada backup
- **Faster Response** - Parallel execution lebih cepat
- **Better Quality** - Mengambil hasil terbaik yang tersedia
- **Zero Downtime** - Selalu ada model yang available

## 🌟 Fitur AI

### 1. Natural Language Prompt

Buat konfigurasi lengkap dari deskripsi bahasa natural:

```
"Create a modern SaaS landing page for a project management tool.
Include hero section, features, pricing, testimonials, and contact form."
```

AI akan menghasilkan:

- Site configuration lengkap
- Theme yang sesuai
- Multiple pages dengan sections yang tepat
- Component content yang realistic

### 2. AI Site Config Generator

Generate complete site configuration dengan input terstruktur:

**Input:**

- Site Name (required)
- Site Description (required)
- Industry (optional)
- Target Audience (optional)
- Style Preference (optional)

**Output:**

- Complete site metadata
- Theme configuration (colors, fonts, spacing)
- Navigation bar with appropriate menu items
- Footer dengan links dan social media
- 3-5 pages dengan relevant sections

### 3. AI Page Generator

Generate single page configuration:

**Input:**

- Path (required)
- Title (required)
- Description (optional)
- Purpose (optional)

**Output:**

- Page metadata
- 3-5 appropriate sections
- Component configurations

### 4. AI Component Generator

Generate single component dengan context:

**Input:**

- Component Type (hero, features, grid, etc.)
- Context (optional) - tujuan component
- Content Requirements (optional) - specific content

**Output:**

- Complete component configuration
- Realistic content
- Proper structure untuk component type

### 5. AI Component Enhancer

Perbaiki atau tingkatkan component yang sudah ada:

**Input:**

- Existing component
- Enhancement instructions

**Output:**

- Enhanced component dengan improvements

## 🚀 API Endpoints

### Backend API (Port 7007)

```bash
# AI Generate Site Config
POST /api/vela-api-spec/ai/generate/site-config
Content-Type: application/json

{
  "siteName": "My Startup",
  "siteDescription": "Revolutionary platform",
  "industry": "SaaS",
  "targetAudience": "Small businesses",
  "style": "Modern"
}

# AI Generate Page
POST /api/vela-api-spec/ai/generate/page
Content-Type: application/json

{
  "path": "/about",
  "title": "About Us",
  "description": "Learn about our company",
  "purpose": "Showcase team and values"
}

# AI Generate Component
POST /api/vela-api-spec/ai/generate/component/hero
Content-Type: application/json

{
  "context": "Homepage hero for fitness app",
  "content": "Include tagline about health tracking"
}

# AI Enhance Component
POST /api/vela-api-spec/ai/enhance/component
Content-Type: application/json

{
  "component": { ... existing component ... },
  "instructions": "Make it more engaging and add social proof"
}

# AI Generate from Prompt
POST /api/vela-api-spec/ai/generate/from-prompt
Content-Type: application/json

{
  "prompt": "Create a portfolio site for a photographer"
}
```

## 🔥 AI Models

Sistem menggunakan **3 AI models** yang berjalan parallel dengan fallback otomatis:

### Model 1: Amazon Nova 2 Lite

- **ID**: `amazon/nova-2-lite-v1:free`
- **Type**: Fast & Efficient
- **Strengths**: Quick responses, reliable JSON output
- **Best for**: General site generation, quick prototyping

### Model 2: Kwaipilot Kat Coder Pro

- **ID**: `kwaipilot/kat-coder-pro:free`
- **Type**: Coding Specialist
- **Strengths**: Code structure, technical accuracy
- **Best for**: Component generation, complex configurations

### Model 3: OpenAI GPT OSS 120B

- **ID**: `openai/gpt-oss-120b:free`
- **Type**: General Purpose
- **Strengths**: Content quality, creative output
- **Best for**: Natural language prompts, content generation

### 🎯 Execution Strategy

```
User Request → Parallel Execution
                    ↓
        ┌───────────┼───────────┐
        ↓           ↓           ↓
    Model 1     Model 2     Model 3
        ↓           ↓           ↓
    Result 1    Result 2    Result 3
        └───────────┼───────────┘
                    ↓
        First Successful Result
                    ↓
            Return to User
```

**Benefits**:

- ⚡ **Faster**: Parallel = No waiting
- 🛡️ **Reliable**: 3 chances to succeed
- 🎯 **Smart**: Best result wins
- 🔄 **Failsafe**: Auto-fallback on error

## ⚙️ Konfigurasi

### 1. Set API Key di Environment Variable

File `.env` di root project:

```bash
# OpenRouter API Key
OPENROUTER_API_KEY=your_api_key_here
```

### 2. Konfigurasi di app-config.yaml

Sudah otomatis ter-configure:

```yaml
vela:
  openrouter:
    apiKey: ${OPENROUTER_API_KEY}
  jina:
    apiKey: ${JINA_API_KEY}
```

### 3. Dapatkan API Key

1. Buka https://openrouter.ai/keys
2. Sign up / Login
3. Create new API key
4. Copy key ke `.env` file

## 🎯 Cara Menggunakan

### Via Frontend UI (Recommended)

1. Buka `http://localhost:3000/vela-api-spec`
2. Klik tab **"🤖 AI Generator"**
3. Pilih mode generation:
   - **Natural Language Prompt** - describe what you want
   - **Complete Site Config** - structured input
   - **Single Page** - generate one page
   - **Single Component** - generate one component
4. Fill in the form
5. Click **"✨ Generate with AI"**
6. Wait 10-30 seconds for AI to generate
7. View result di bawah

### Via API Direct

```bash
# Example: Generate Site Config
curl -X POST http://localhost:7007/api/vela-api-spec/ai/generate/site-config \
  -H "Content-Type: application/json" \
  -d '{
    "siteName": "TechFlow",
    "siteDescription": "Streamline your workflow with AI-powered tools",
    "industry": "SaaS",
    "targetAudience": "Developers and teams",
    "style": "Modern and clean"
  }'

# Example: Natural Language Prompt
curl -X POST http://localhost:7007/api/vela-api-spec/ai/generate/from-prompt \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a landing page for an AI chatbot service with features, pricing, and demo section"
  }'
```

## 🔥 AI Models

Default model: `amazon/nova-2-lite-v1:free`

Model ini:

- ✅ **Free** - tidak ada biaya
- ✅ **Fast** - response dalam 10-30 detik
- ✅ **Smart** - mampu generate JSON complex
- ✅ **Reliable** - consistent output format

Anda bisa ganti model di `AIGenerator.ts` jika ingin model yang lebih powerful.

## 📊 Response Format

AI akan generate JSON yang valid sesuai schema:

```json
{
  "site": {
    "name": "TechFlow",
    "description": "Streamline your workflow",
    "url": "https://techflow.com",
    "logo": "/assets/logo.svg",
    "favicon": "/favicon.ico"
  },
  "theme": {
    "primaryColor": "#6366f1",
    "secondaryColor": "#8b5cf6",
    "accentColor": "#ec4899",
    "fontFamily": "Inter, sans-serif",
    "spacing": "comfortable"
  },
  "navbar": { ... },
  "footer": { ... },
  "pages": [ ... ]
}
```

## 🛠️ Error Handling

AI Generator memiliki robust error handling:

1. **No API Key** - Clear error message
2. **Invalid Response** - Automatic JSON extraction
3. **Timeout** - 10-30 detik timeout
4. **Parse Error** - Fallback JSON extraction

## 💡 Best Practices

### 1. Natural Language Prompts

- **Good**: "Create a modern e-commerce site for sustainable fashion with hero, product grid, about section, and newsletter signup"
- **Bad**: "make website"

### 2. Site Config Generation

- Provide industry dan target audience untuk hasil lebih relevant
- Specify style preference untuk consistency

### 3. Component Generation

- Berikan context yang jelas
- Specify content requirements untuk hasil lebih specific

### 4. Performance

- AI generation memakan waktu 10-30 detik
- Jangan spam request
- Cache hasil yang bagus

## 🎨 UI Features

Frontend plugin menyediakan:

1. **Mode Selector** - 4 generation modes
2. **Smart Forms** - Required/optional fields clearly marked
3. **Loading States** - Progress indicator during generation
4. **Error Display** - Clear error messages
5. **Result Display** - JSON dengan syntax highlighting
6. **Validation** - Built-in validation for generated configs

## 🔐 Security

- API key stored di environment variables
- Tidak pernah exposed ke frontend
- Backend-only API calls
- Optional authentication support

## 📈 Comparison: Manual vs AI

| Aspect        | Manual Generation    | AI Generation     |
| ------------- | -------------------- | ----------------- |
| Speed         | 30-60 minutes        | 10-30 seconds     |
| Quality       | Depends on skill     | Consistently good |
| Creativity    | Limited by knowledge | AI suggestions    |
| Effort        | High                 | Low               |
| Customization | Full control         | Need refinement   |

## 🎯 Use Cases

1. **Rapid Prototyping** - Quick mockups untuk client
2. **Learning** - Lihat best practices dari AI
3. **Inspiration** - Get ideas untuk structure
4. **Boilerplate** - Starting point untuk customization
5. **Testing** - Generate test data

## 🚀 Next Steps

After AI generation:

1. **Review** - Check generated content
2. **Customize** - Modify sesuai needs
3. **Validate** - Use validation endpoint
4. **Enhance** - Use AI Enhancer untuk improvements
5. **Export** - Save ke project

---

**Happy Generating! 🎉**

Untuk pertanyaan atau issues, check plugin documentation atau backend logs.
