# 📝 Dual Format Output Feature

## Overview

Vela API Spec sekarang mendukung output dalam 2 format: **JSON** dan **YAML** untuk semua endpoint generate.

## 🎯 Fitur Utama

### Backend Changes

1. **Format Converter Utility** (`src/utils/formatConverter.ts`)

   - Konversi otomatis JSON → YAML
   - Support untuk nested objects dan arrays
   - Handle multiline strings dan special characters

2. **Modified Endpoints** (semua generate endpoints)
   - `POST /generate/site-config`
   - `POST /generate/page`
   - `POST /generate/component/:type`
   - `POST /ai/generate/site-config`
   - `POST /ai/generate/page`
   - `POST /ai/generate/component/:type`
   - `POST /ai/enhance/component`
   - `POST /ai/generate/from-prompt`

### Response Format (New)

```json
{
  "json": { ... },           // Original JSON object
  "yaml": "...",             // YAML string representation
  "jsonString": "...",       // JSON string (formatted)
  "downloads": {
    "json": {
      "filename": "output.json",
      "content": "...",
      "mimeType": "application/json"
    },
    "yaml": {
      "filename": "output.yaml",
      "content": "...",
      "mimeType": "text/yaml"
    }
  }
}
```

### Frontend Changes

1. **ResultDisplay Component Updates**

   - Toggle button: JSON ↔ YAML
   - Syntax highlighting untuk kedua format
   - Download button untuk JSON dan YAML
   - Backward compatible dengan response format lama

2. **UI Features**
   - Button group untuk switch format
   - Download JSON button dengan icon
   - Download YAML button dengan icon
   - Auto-detect format dan display yang sesuai

## 🚀 Usage Example

### Backend (Router)

```typescript
const result = await aiGenerator.generateSiteConfig({
  siteName: 'My Site',
  siteDescription: 'A cool website',
});

const formatted = FormatConverter.createDownloadableResponse(
  result,
  'site-config',
);

res.json(formatted);
```

### Frontend (Component)

```tsx
<ResultDisplay
  generatedResult={result} // Auto-detect format
  error={error}
  validationResult={validation}
  onClearError={() => setError(null)}
  onClearValidation={() => setValidation(null)}
/>
```

## 📋 Testing

Test endpoint masih sama, tapi response sekarang include format tambahan:

```bash
# Run backend
yarn start

# Test endpoint
curl -X POST http://localhost:7007/api/vela-api-spec/generate/page \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/test",
    "title": "Test Page",
    "sections": [{"type": "hero"}]
  }'
```

Response akan include `json`, `yaml`, dan `downloads` fields.

## 🔄 Backward Compatibility

Frontend component akan detect format response:

- **New format**: Display toggle + download buttons
- **Old format**: Display JSON only (fallback)

Tidak perlu migration untuk existing code!

## 📦 Files Modified

### Backend

- ✅ `plugins/vela-api-spec/src/router.ts` - Add format conversion
- ✅ `plugins/vela-api-spec/src/utils/formatConverter.ts` - New utility

### Frontend

- ✅ `plugins/vela-api-spec-fe/src/components/VelaApiSpecPage/ResultDisplay.tsx` - Add format toggle & download

---

**Created:** December 7, 2025  
**Version:** 2.0.0 - Dual Format Support
