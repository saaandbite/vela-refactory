# OpenSpec Generator - Design Document

## Overview

OpenSpec Generator adalah sistem yang mengintegrasikan Jina AI Reader untuk ekstraksi konten web dan OpenRouter AI untuk menghasilkan dokumen spesifikasi teknis secara otomatis. Sistem ini terdiri dari komponen frontend React dengan Material-UI dan backend service yang menangani API calls ke external services.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│   User Input    │
│   (URL Form)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     OpenSpec Generator UI           │
│  ┌──────────────────────────────┐  │
│  │  1. URL Input Component      │  │
│  │  2. Content Display          │  │
│  │  3. Spec Generator Controls  │  │
│  │  4. Document Viewer          │  │
│  │  5. PDF Exporter             │  │
│  └──────────────────────────────┘  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│      Backend API Service            │
│  ┌──────────────────────────────┐  │
│  │  - Jina AI Integration       │  │
│  │  - OpenRouter AI Integration │  │
│  │  - Spec Generation Logic     │  │
│  └──────────────────────────────┘  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│      External Services              │
│  - Jina AI Reader API               │
│  - OpenRouter AI API                │
└─────────────────────────────────────┘
```

### Component Architecture

```
OpenSpecGenerator/
├── OpenSpecPage.tsx (Main Container)
│   ├── State Management
│   ├── API Integration
│   └── Error Handling
│
├── components/
│   ├── UrlInput.tsx
│   │   ├── URL validation
│   │   ├── Submit handler
│   │   └── Loading state
│   │
│   ├── ContentDisplay.tsx
│   │   ├── Markdown rendering
│   │   ├── Syntax highlighting
│   │   └── Copy functionality
│   │
│   ├── SpecGeneratorControls.tsx
│   │   ├── Model selection
│   │   ├── Generation buttons
│   │   └── Progress indicators
│   │
│   ├── DocumentViewer.tsx
│   │   ├── Tabbed interface
│   │   ├── Edit mode
│   │   └── Regenerate option
│   │
│   └── ExportButton.tsx
│       ├── PDF generation
│       └── Download handler
│
├── services/
│   ├── jinaService.ts
│   │   └── Content extraction
│   │
│   ├── specGeneratorService.ts
│   │   ├── Requirements generation
│   │   ├── Design generation
│   │   └── Tasks generation
│   │
│   └── pdfExporter.ts
│       └── PDF creation
│
└── utils/
    ├── cache.ts
    ├── validators.ts
    └── formatters.ts
```

## Components and Interfaces

### 1. UrlInput Component

**Purpose:** Accept and validate URL input from user

**Props:**
```typescript
interface UrlInputProps {
  onSubmit: (url: string) => Promise<void>;
  loading: boolean;
  error?: string;
}
```

**Features:**
- URL format validation
- Submit button with loading state
- Error message display
- Recent URLs dropdown (from cache)

### 2. ContentDisplay Component

**Purpose:** Display extracted content from Jina AI

**Props:**
```typescript
interface ContentDisplayProps {
  content: string;
  loading: boolean;
  onCopy?: () => void;
}
```

**Features:**
- Markdown rendering with syntax highlighting
- Collapsible sections
- Copy to clipboard
- Character count display

### 3. SpecGeneratorControls Component

**Purpose:** Control spec generation process

**Props:**
```typescript
interface SpecGeneratorControlsProps {
  hasContent: boolean;
  hasRequirements: boolean;
  hasDesign: boolean;
  onGenerateRequirements: (model: string) => Promise<void>;
  onGenerateDesign: (model: string) => Promise<void>;
  onGenerateTasks: (model: string) => Promise<void>;
  loading: boolean;
  currentStep?: 'requirements' | 'design' | 'tasks';
}
```

**Features:**
- Model selection dropdown
- Sequential generation buttons
- Progress stepper
- Estimated time display

### 4. DocumentViewer Component

**Purpose:** Display and edit generated spec documents

**Props:**
```typescript
interface DocumentViewerProps {
  documents: {
    requirements?: string;
    design?: string;
    tasks?: string;
  };
  onEdit: (docType: string, content: string) => void;
  onRegenerate: (docType: string) => Promise<void>;
}
```

**Features:**
- Tabbed interface (Requirements, Design, Tasks)
- Inline editing with markdown preview
- Regenerate button per document
- Version history (optional)

### 5. ExportButton Component

**Purpose:** Export complete spec to PDF

**Props:**
```typescript
interface ExportButtonProps {
  documents: SpecDocuments;
  sourceUrl: string;
  disabled: boolean;
}
```

## Data Models

### SpecDocuments

```typescript
interface SpecDocuments {
  requirements?: string;
  design?: string;
  tasks?: string;
  metadata: {
    sourceUrl: string;
    generatedAt: Date;
    model: string;
    version: string;
  };
}
```

### JinaResponse

```typescript
interface JinaResponse {
  content: string;
  title: string;
  url: string;
  extractedAt: Date;
}
```

### GenerationRequest

```typescript
interface GenerationRequest {
  content: string;
  type: 'requirements' | 'design' | 'tasks';
  model: string;
  context?: {
    requirements?: string;
    design?: string;
  };
}
```

### CacheEntry

```typescript
interface CacheEntry {
  url: string;
  documents: SpecDocuments;
  jinaContent: JinaResponse;
  timestamp: number;
  ttl: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: URL Validation Consistency
*For any* string input, the URL validator should return true only if the string is a valid HTTP/HTTPS URL format
**Validates: Requirements 1.1**

### Property 2: Content Extraction Idempotency
*For any* valid URL, extracting content multiple times should return equivalent content (ignoring timestamps)
**Validates: Requirements 1.2, 1.3**

### Property 3: Generation Sequence Dependency
*For any* spec generation workflow, design generation should only be enabled when requirements exist, and tasks generation should only be enabled when design exists
**Validates: Requirements 3.1, 4.1**

### Property 4: Context Preservation
*For any* generation step, the AI prompt should include all previously generated documents as context
**Validates: Requirements 3.2, 4.2**

### Property 5: Edit Persistence
*For any* document edit, saving should update the displayed content and canceling should restore the original
**Validates: Requirements 6.3, 6.4**

### Property 6: Cache Consistency
*For any* URL, if a cached spec exists and is not expired, loading it should restore all documents exactly as they were saved
**Validates: Requirements 9.2, 9.4**

### Property 7: PDF Completeness
*For any* complete spec (with requirements, design, and tasks), the exported PDF should contain all three documents
**Validates: Requirements 5.2**

### Property 8: Loading State Exclusivity
*For any* generation operation, while loading is true, all generation buttons should be disabled
**Validates: Requirements 8.2**

### Property 9: Error Recovery
*For any* failed generation, the system should preserve all existing documents and allow retry
**Validates: Requirements 2.5, 3.5, 4.5**

### Property 10: Model Selection Persistence
*For any* model selection change, the system should remember the preference for subsequent generations
**Validates: Requirements 10.5**

## Error Handling

### Error Categories

1. **Network Errors**
   - Jina AI API unavailable
   - OpenRouter API unavailable
   - Timeout errors
   - Rate limiting

2. **Validation Errors**
   - Invalid URL format
   - Empty content
   - Malformed AI responses

3. **Generation Errors**
   - AI model errors
   - Parsing failures
   - Context too large

4. **Storage Errors**
   - Cache write failures
   - PDF generation failures

### Error Handling Strategy

```typescript
class SpecGeneratorError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean,
    public retryable: boolean
  ) {
    super(message);
  }
}

// Error codes
const ERROR_CODES = {
  INVALID_URL: 'INVALID_URL',
  JINA_API_ERROR: 'JINA_API_ERROR',
  OPENROUTER_API_ERROR: 'OPENROUTER_API_ERROR',
  GENERATION_FAILED: 'GENERATION_FAILED',
  CACHE_ERROR: 'CACHE_ERROR',
  PDF_EXPORT_ERROR: 'PDF_EXPORT_ERROR',
};
```

### Retry Logic

- Network errors: 3 retries with exponential backoff
- Rate limiting: Wait and retry based on rate limit headers
- Generation errors: Allow manual retry with option to change model
- Validation errors: No retry, show error message

## Testing Strategy

### Unit Tests

1. **URL Validation**
   - Test valid HTTP/HTTPS URLs
   - Test invalid formats
   - Test edge cases (localhost, IP addresses)

2. **Content Extraction**
   - Test successful extraction
   - Test error handling
   - Test timeout scenarios

3. **Spec Generation**
   - Test requirements generation
   - Test design generation with context
   - Test tasks generation with full context

4. **Cache Operations**
   - Test cache set/get
   - Test cache expiration
   - Test cache invalidation

5. **PDF Export**
   - Test complete spec export
   - Test partial spec export
   - Test formatting

### Property-Based Tests

Property-based tests will be implemented using `fast-check` library for TypeScript. Each test should run minimum 100 iterations.

1. **Property 1: URL Validation Consistency**
   ```typescript
   // Generate random strings and valid URLs
   // Verify validator returns true only for valid URLs
   ```

2. **Property 3: Generation Sequence Dependency**
   ```typescript
   // Generate random states of documents
   // Verify button enablement follows dependency rules
   ```

3. **Property 5: Edit Persistence**
   ```typescript
   // Generate random document content and edits
   // Verify save/cancel behavior
   ```

4. **Property 6: Cache Consistency**
   ```typescript
   // Generate random spec documents
   // Verify cache round-trip preserves content
   ```

### Integration Tests

1. Test full workflow: URL → Content → Requirements → Design → Tasks → PDF
2. Test error recovery at each step
3. Test cache integration
4. Test model switching

### Manual Testing Checklist

- [ ] Test with various website types (docs, blogs, APIs)
- [ ] Test with long content (>10k words)
- [ ] Test with different AI models
- [ ] Test offline behavior
- [ ] Test PDF output quality
- [ ] Test edit and regenerate flows

## API Integration

### Jina AI Reader

**Endpoint:** `POST /api/vela-backend/radar/scrape-url`

**Request:**
```typescript
{
  url: string;
}
```

**Response:**
```typescript
{
  content: string;
  title: string;
  url: string;
}
```

### OpenRouter AI

**Endpoint:** `POST /api/vela-backend/radar/generate-spec`

**Request:**
```typescript
{
  content: string;
  type: 'requirements' | 'design' | 'tasks';
  model: string;
  context?: {
    requirements?: string;
    design?: string;
  };
}
```

**Response:**
```typescript
{
  document: string;
  model: string;
  tokensUsed: number;
}
```

## Performance Considerations

1. **Content Extraction:** 2-5 seconds (Jina AI)
2. **Requirements Generation:** 10-30 seconds (depends on content length)
3. **Design Generation:** 15-45 seconds (depends on requirements complexity)
4. **Tasks Generation:** 10-20 seconds
5. **PDF Export:** 1-3 seconds

### Optimization Strategies

- Cache Jina AI responses (1 hour TTL)
- Stream AI responses for better UX
- Lazy load PDF library
- Debounce edit operations
- Use Web Workers for PDF generation

## Security Considerations

1. **API Keys:** Store in environment variables only
2. **URL Validation:** Prevent SSRF attacks
3. **Content Sanitization:** Sanitize extracted content before display
4. **Rate Limiting:** Implement client-side rate limiting
5. **CORS:** Ensure proper CORS configuration for backend APIs

## Future Enhancements

1. Support for multiple URLs (batch processing)
2. Custom prompt templates
3. Collaborative editing
4. Export to other formats (Markdown, DOCX)
5. Integration with project management tools
6. AI model fine-tuning based on user feedback
