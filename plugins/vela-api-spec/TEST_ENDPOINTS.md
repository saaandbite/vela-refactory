# 🧪 Vela API Spec Endpoint Testing

Script untuk test semua endpoint vela-api-spec yang tidak memerlukan authentication.

## 📋 Endpoint yang Ditest

### Basic Endpoints (No Auth Required)

- ✅ `GET /health` - Health check
- ✅ `GET /templates/site-config` - Get site config template
- ✅ `GET /schemas/components` - Get all component schemas
- ✅ `GET /schemas/components/:type` - Get specific component schema
- ✅ `GET /examples/:type` - Get example configurations

### Generate Endpoints (No Auth Required)

- ✅ `POST /generate/page` - Generate page configuration
- ✅ `POST /generate/component/:type` - Generate component
- ✅ `POST /validate/site-config` - Validate site configuration

### AI Endpoints (Optional Auth - Works without token)

- 🤖 `POST /ai/generate/site-config` - AI-powered site generation
- 🤖 `POST /ai/generate/page` - AI-powered page generation
- 🤖 `POST /ai/generate/component/:type` - AI-powered component generation
- 🤖 `POST /ai/enhance/component` - AI component enhancement
- 🤖 `POST /ai/generate/from-prompt` - Generate from natural language

## 🚀 Quick Start

### Prerequisites

1. **Backend harus berjalan:**

   ```bash
   yarn start
   ```

   Backend akan running di `http://localhost:7007`

2. **OpenRouter API Key (untuk AI endpoints):**
   ```bash
   # Edit .env file
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

### Running Tests

**Option 1: Menggunakan ts-node**

```bash
# Install ts-node jika belum
yarn add -D ts-node

# Run test
yarn ts-node plugins/vela-api-spec/test-endpoints.ts
```

**Option 2: Compile dan run**

```bash
# Compile TypeScript
yarn tsc plugins/vela-api-spec/test-endpoints.ts

# Run compiled JavaScript
node plugins/vela-api-spec/test-endpoints.js
```

**Option 3: Menggunakan npm script (tambahkan ke package.json)**

```json
{
  "scripts": {
    "test:endpoints": "ts-node plugins/vela-api-spec/test-endpoints.ts"
  }
}
```

Lalu run:

```bash
yarn test:endpoints
```

## 📊 Output Example

```
🚀 Starting vela-api-spec endpoint tests...

Base URL: http://localhost:7007/api/vela-api-spec

📋 Testing Basic Endpoints...
✅ Health Check - 200 (15ms)
✅ Get Site Config Template - 200 (23ms)
✅ Get All Component Schemas - 200 (18ms)
✅ Get Hero Schema - 200 (12ms)
✅ Get Features Schema - 200 (11ms)
✅ Get Minimal Example - 200 (14ms)
✅ Get Full Example - 200 (16ms)

📝 Testing Generate Endpoints...
✅ Generate Page - 200 (45ms)
✅ Generate Hero Component - 200 (38ms)
✅ Validate Site Config - 200 (22ms)

🤖 Testing AI Endpoints...
Note: These require OPENROUTER_API_KEY in .env

✅ AI: Generate Site Config - 200 (2345ms)
✅ AI: Generate Page - 200 (1876ms)
✅ AI: Generate Hero Component - 200 (1543ms)
✅ AI: Enhance Component - 200 (1234ms)
✅ AI: Generate from Natural Language - 200 (2567ms)

============================================================
📊 TEST SUMMARY
============================================================
Total Tests: 15
✅ Passed: 15 (100.0%)
❌ Failed: 0 (0.0%)
⏱️  Average Response Time: 645ms

============================================================
📋 DETAILED RESULTS
============================================================
✅ Health Check - 200 (15ms)
✅ Get Site Config Template - 200 (23ms)
...

🎉 All tests passed!
```

## 🔧 Customization

### Test Specific Endpoints Only

Edit `test-endpoints.ts` dan comment out endpoints yang tidak ingin ditest:

```typescript
// Skip AI endpoints
// await testEndpoint('POST', '/ai/generate/site-config', ...);
```

### Change Base URL

Edit konstanta di awal file:

```typescript
const BASE_URL = 'http://your-custom-url/api/vela-api-spec';
```

### Add New Test Cases

Tambahkan test case baru:

```typescript
await testEndpoint(
  'POST',
  '/your-endpoint',
  { your: 'payload' },
  'Your Test Description',
);
```

## ⚠️ Troubleshooting

### Error: Connection Refused

**Masalah:** Backend belum running
**Solusi:**

```bash
yarn start
```

### AI Endpoints Return 500

**Masalah:** OpenRouter API key tidak dikonfigurasi atau invalid
**Solusi:**

1. Cek file `.env` ada `OPENROUTER_API_KEY`
2. Pastikan key valid dari https://openrouter.ai/keys
3. Restart backend setelah update `.env`

### Error: Cannot find module 'ts-node'

**Masalah:** ts-node belum terinstall
**Solusi:**

```bash
yarn add -D ts-node
```

### TypeScript Compilation Error

**Masalah:** TypeScript version mismatch
**Solusi:**

```bash
yarn add -D typescript@~5.8.0
```

## 📝 Notes

- **Test Duration:** Basic endpoints ~100-200ms, AI endpoints ~1-3 detik per request
- **Rate Limiting:** OpenRouter free tier memiliki rate limit, test AI endpoints akan lebih lambat
- **Parallel Testing:** Saat ini sequential, bisa diubah jadi parallel dengan `Promise.all()` jika perlu
- **Authentication:** Semua endpoint ini designed untuk work tanpa auth token

## 🔗 Related Files

- Backend Router: `plugins/vela-api-spec/src/router.ts`
- AI Generator: `plugins/vela-api-spec/src/service/AIGenerator.ts`
- API Spec Generator: `plugins/vela-api-spec/src/service/ApiSpecGenerator.ts`
- Component Schemas: `plugins/vela-api-spec/src/service/ComponentSchemas.ts`

---

**Created:** December 7, 2025  
**Version:** 1.0.0
