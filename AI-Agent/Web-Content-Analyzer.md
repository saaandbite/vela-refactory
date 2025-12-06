# Web Content Analyzer - AI-Powered Web Scraping & Analysis

## Overview

Web Content Analyzer adalah fitur di VELA Radar yang memungkinkan scraping dan analisis konten web menggunakan AI. Fitur ini mengekstrak data dari URL, menganalisisnya, dan menghasilkan output dalam format CSV, Summary, dan Visualization. Terintegrasi dengan OpenSpec Generator untuk spec-driven development.

## Fitur Utama

### 1. Web Scraping dengan Jina Reader
- **URL Input**: Masukkan URL website untuk di-scrape
- **Jina Reader API**: Ekstrak konten dalam format optimized untuk AI
- **Auto-cleaning**: Otomatis remove HTML tags dan special characters
- **Multi-format**: Support untuk berbagai jenis website

### 2. AI-Powered Analysis
- **Content Extraction**: Ekstrak data terstruktur dari konten web
- **Data Cleaning**: Normalisasi text, standardisasi format
- **Smart Parsing**: Identifikasi patterns dan struktur data
- **Multi-language**: Support Indonesian, English, dan bahasa lainnya

### 3. Output Formats

#### CSV Export
- **Structured Data**: Data dalam format tabular
- **Clean Headers**: Snake_case column names
- **Ready for Analysis**: Format siap untuk import ke tools lain
- **Download**: One-click download CSV file

#### Summary Card
- **Key Insights**: Ringkasan utama dari konten
- **Statistics**: Jumlah items, categories, dll
- **Quick Overview**: Lihat hasil analisis dengan cepat

#### Visualization
- **Data Table**: Interactive table dengan sort/filter
- **Charts**: Visual representation dari data
- **Insights**: Key findings dan patterns

### 4. Integration dengan OpenSpec
- **Generate Technical Spec**: Button untuk generate spec dari hasil analisis
- **Auto-populate**: Content otomatis ter-load ke OpenSpec Generator
- **Seamless Workflow**: URL → Extract → Analyze → Generate Spec

## Setup

### 1. Install Dependencies
```bash
yarn workspace @internal/backstage-plugin-vela add papaparse @types/papaparse
```

### 2. Konfigurasi API Keys
Tambahkan ke file `.env`:
```bash
OPENROUTER_API_KEY=sk-or-v1-your_key_here
JINA_API_KEY=jina_your_key_here
```

### 3. Backend Configuration
File: `app-config.yaml`
```yaml
vela:
  openrouter:
    apiKey: ${OPENROUTER_API_KEY}
  jina:
    apiKey: ${JINA_API_KEY}
```

## Cara Penggunaan

### Step 1: Akses Web Content Analyzer
1. Buka aplikasi di http://localhost:3000
2. Navigasi ke **VELA Radar** di sidebar
3. Tab **Web Content Analyzer** adalah default tab

### Step 2: Input URL
1. Masukkan URL website yang ingin di-analyze
2. Contoh: `https://en.wikipedia.org/wiki/Hackathon`
3. Klik **Extract & Analyze**

### Step 3: Pilih AI Model
- **Amazon Nova Lite** (Fast) - Recommended untuk quick analysis
- **Kat Coder Pro** (Accurate) - Untuk hasil lebih detail
- **Nemotron Nano** (Balanced) - Balance antara speed dan accuracy

### Step 4: Tunggu Hasil
1. **Extraction**: 2-5 detik (Jina Reader)
2. **Analysis**: 5-15 detik (AI processing)
3. **Rendering**: Instant

### Step 5: Review Output

#### CSV Data
- Lihat data dalam format table
- Sort dan filter columns
- Download CSV file

#### Summary
- Baca ringkasan key insights
- Lihat statistics
- Understand data structure

#### Insights
- Visual charts dan graphs
- Key findings
- Patterns dan trends

### Step 6: Generate Technical Spec (Optional)
1. Klik **Generate Technical Spec**
2. Content otomatis ter-load ke OpenSpec Generator
3. Generate Requirements → Design → Tasks

## Architecture

```
WebContentAnalyzer/
├── WebContentAnalyzer.tsx        # Main component
├── components/
│   ├── DataTable.tsx             # CSV data display
│   ├── SummaryCard.tsx           # Summary insights
│   ├── InsightsCard.tsx          # Visual insights
│   └── ExportButton.tsx          # CSV download
├── services/
│   ├── jinaService.ts            # Jina Reader API
│   └── analyzerService.ts        # Backend API calls
└── types.ts                      # TypeScript interfaces
```

## Backend Services

### ContentAnalyzer.ts
Location: `plugins/vela-backend/src/service/modules/radar/ContentAnalyzer.ts`

**Features:**
- Jina Reader integration
- OpenRouter AI analysis
- Data cleaning dan normalization
- CSV generation
- Error handling

**Methods:**
```typescript
async analyzeContent(url: string, model: string): Promise<AnalysisResult>
```

**Data Cleaning Rules:**
1. Remove HTML tags dan special characters
2. Normalize whitespace dan encoding
3. Standardize date formats (ISO 8601)
4. Convert numbers to proper format
5. Handle missing values consistently
6. Remove duplicates
7. Use snake_case for headers

## API Integration

### Jina Reader API
- **Endpoint**: https://r.jina.ai/
- **Method**: POST
- **Headers**:
  - `Authorization: Bearer $JINA_API_KEY`
  - `Content-Type: application/json`
  - `X-Return-Format: text`
  - `X-Retain-Images: none`

**Request:**
```typescript
{
  url: "https://example.com"
}
```

**Response:**
```typescript
{
  code: 200,
  data: {
    title: "Page Title",
    content: "Extracted content...",
    url: "https://example.com"
  }
}
```

### OpenRouter API
- **Model**: amazon/nova-2-lite-v1:free (default)
- **Endpoint**: https://openrouter.ai/api/v1/chat/completions
- **Purpose**: Analyze dan structure extracted content

**Prompt Structure:**
```
Analyze the following web content and extract structured data.

REQUIREMENTS:
1. Identify all data points
2. Create clean CSV format
3. Provide summary
4. Extract key insights

Content: [extracted content]

Return JSON with:
- csv_data: array of objects
- summary: string
- insights: array of key findings
```

## Format Output

### CSV Data Structure
```typescript
interface CSVData {
  headers: string[];      // Column names (snake_case)
  rows: any[][];         // Data rows
  rowCount: number;      // Total rows
}
```

### Analysis Result
```typescript
interface AnalysisResult {
  csv: CSVData;
  summary: {
    title: string;
    description: string;
    totalItems: number;
    categories: string[];
  };
  insights: {
    keyFindings: string[];
    patterns: string[];
    recommendations: string[];
  };
}
```

## Best Practices

### 1. URL Selection
- Pilih pages dengan structured content
- Avoid pages dengan heavy JavaScript
- Check robots.txt untuk permission
- Use specific pages, bukan homepage

### 2. Model Selection
- **Nova Lite**: Quick analysis, simple content
- **Kat Coder Pro**: Complex content, detailed analysis
- **Nemotron**: Balance untuk most use cases

### 3. Data Quality
- Review extracted data sebelum export
- Check for missing values
- Validate data types
- Ensure proper encoding

### 4. Performance
- Avoid scraping terlalu sering (rate limiting)
- Cache results untuk reuse
- Use appropriate timeout settings
- Monitor API quota

## Troubleshooting

### Error: "Failed to extract content"
**Penyebab**: 
- URL tidak accessible
- Jina API key invalid
- Website blocking scraper

**Solusi**:
1. Check URL validity
2. Verify Jina API key di `.env`
3. Try different URL
4. Check internet connection

### Error: "Analysis failed"
**Penyebab**:
- OpenRouter API error
- Content terlalu besar
- Invalid response format

**Solusi**:
1. Check OpenRouter API key
2. Try dengan URL yang lebih simple
3. Check backend logs
4. Reduce content size

### CSV Data Kosong
**Penyebab**:
- Content tidak terstruktur
- AI gagal extract data
- Parsing error

**Solusi**:
1. Try URL dengan structured content
2. Change AI model
3. Check console logs
4. Review extracted content

### Slow Performance
**Penyebab**:
- Large content
- Slow API response
- Network latency

**Solusi**:
1. Use faster model (Nova Lite)
2. Check internet speed
3. Try smaller pages
4. Monitor API status

## Integration dengan OpenSpec Generator

### Workflow
1. **Extract**: Web Content Analyzer scrapes URL
2. **Analyze**: AI extracts structured data
3. **Generate Spec**: Click button to open OpenSpec
4. **Requirements**: AI generates user stories
5. **Design**: Technical architecture
6. **Tasks**: Implementation checklist

### Data Flow
```
URL Input
  ↓
Jina Reader (Extract)
  ↓
ContentAnalyzer (AI Analysis)
  ↓
CSV + Summary + Insights
  ↓
[Generate Technical Spec Button]
  ↓
OpenSpec Generator
  ↓
Requirements → Design → Tasks
```

### Navigation State
Content otomatis ter-pass via React Router state:
```typescript
navigate('/vela/radar/openspec', {
  state: {
    preloadedContent: extractedContent,
    sourceUrl: originalUrl
  }
});
```

## Example Use Cases

### 1. Product Research
- Scrape competitor product pages
- Extract features dan pricing
- Generate comparison CSV
- Create technical spec untuk similar product

### 2. Content Analysis
- Analyze blog posts atau articles
- Extract key topics dan keywords
- Generate content strategy spec
- Plan content creation tasks

### 3. Data Collection
- Scrape public datasets
- Extract structured information
- Clean dan normalize data
- Export untuk further analysis

### 4. Market Research
- Analyze industry reports
- Extract market trends
- Generate insights
- Create research spec

## Security & Privacy

### Data Handling
- No data stored permanently
- All processing in-memory
- API keys secured in `.env`
- HTTPS for all API calls

### Rate Limiting
- Frontend: 10 requests/minute
- Backend: Respects API provider limits
- Exponential backoff on errors
- Retry logic dengan delays

### API Key Protection
- Never commit `.env` to git
- Use environment variables
- Rotate keys regularly
- Monitor usage

## Performance Optimization

### Caching Strategy
- Cache disabled untuk fresh analysis
- Consider enabling for repeated URLs
- TTL: 1 hour (if enabled)
- In-memory cache only

### Batching
- Not applicable (single URL per request)
- Consider batch mode untuk multiple URLs (future)

### Error Recovery
- Automatic retry (3x)
- Exponential backoff
- Graceful degradation
- User-friendly error messages

## Future Enhancements

- [ ] Batch URL processing
- [ ] Scheduled scraping jobs
- [ ] Custom extraction rules
- [ ] Advanced data transformation
- [ ] Export to multiple formats (Excel, JSON)
- [ ] Integration dengan database
- [ ] Real-time monitoring
- [ ] Webhook notifications
- [ ] API rate limit dashboard
- [ ] Custom AI prompts

## Support

Untuk pertanyaan atau issue:
1. Check dokumentasi ini
2. Review error messages di console
3. Check backend logs
4. Verify API keys di `.env`
5. Contact team VELA

## Related Documentation

- [CSV-Analyzer.md](./CSV-Analyzer.md) - CSV analysis features
- [OpenSpec.md](./OpenSpec.md) - Spec generation workflow
- [Jina.md](./Jina.md) - Jina AI API reference
