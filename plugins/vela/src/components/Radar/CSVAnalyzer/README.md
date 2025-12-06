# CSV Analyzer

AI-powered CSV data analysis tool with sentiment analysis and topic clustering.

## Features

### ✅ CSV Upload and Parsing
- **Client-side parsing** with PapaParse
- **Web Worker** for large files (>1MB)
- **File size validation** (max 10MB)
- **Error handling** for invalid formats
- **Drag and drop** support

### ✅ Data Display
- Material UI table with dynamic columns
- **Pagination** (50 rows per page)
- **Sorting** by any column
- **Filtering** across all columns
- **Tooltips** for truncated content

### ✅ AI-Powered Analysis
- **Multiple AI Models** via OpenRouter:
  - Amazon Nova Lite (Fast)
  - Kat Coder Pro (Accurate)
  - Nvidia Nemotron Nano (Balanced)
- **Sentiment analysis** - Positive/Negative/Neutral classification
- **Topic clustering** - Automatic theme detection
- **URL enrichment** with Jina Reader API
- **Configurable sampling** (default: 50 rows)
- **Retry logic** with exponential backoff

### ✅ Sentiment Visualization
- **Pie chart** with Recharts
- **Color-coded** sentiment labels
- **Interactive tooltips**
- **Automatic updates**

### ✅ Performance Optimizations
- **Web Worker** for CSV parsing
- **In-memory caching** (1 hour TTL)
- **Rate limiting** (10 req/min)
- **Virtual scrolling** for large tables

## Setup

1. Add your API keys to `.env`:
```bash
# OpenRouter for AI models (Free tier available)
REACT_APP_OPENROUTER_API_KEY=your_openrouter_key_here

# Jina for URL content extraction (Optional)
REACT_APP_JINA_API_KEY=your_jina_key_here
```

2. Get your API keys:
   - OpenRouter: https://openrouter.ai/keys
   - Jina AI: https://jina.ai/

## Usage

1. **Upload CSV File**
   - Click "Upload CSV" button or drag and drop
   - Select a CSV file (max 10MB)
   - Data will be displayed in a table

2. **Run Analysis**
   - **Select AI Model**: Choose from 3 free models
   - **Select Text Column**: Column containing text to analyze
   - **Set Sample Size**: 1-500 rows (default: 50)
   - **Click "Analyze Sentiment"**: For sentiment classification
   - **Click "Analyze Topics"**: For topic clustering
   - Wait for results (5-15 seconds depending on model)

3. **View Results**
   - Sentiment pie chart shows distribution
   - New columns added to table
   - Export or further analyze data

## Architecture

```
CSVAnalyzer/
├── components/
│   ├── CSVUploader.tsx       # File upload with drag & drop
│   ├── DataTable.tsx         # Table with sorting/filtering
│   ├── AnalysisControls.tsx  # Analysis configuration
│   └── SentimentChart.tsx    # Pie chart visualization
├── services/
│   └── aiService.ts          # OpenRouter + Jina API integration
├── workers/
│   └── csvParser.worker.ts   # Web Worker for parsing
├── utils/
│   ├── cache.ts              # In-memory caching
│   └── rateLimiter.ts        # API rate limiting
└── types.ts                  # TypeScript interfaces
```

## API Integration

### OpenRouter API
The analyzer uses OpenRouter with multiple free AI models:

**Available Models:**
1. **Amazon Nova Lite** (`amazon/nova-2-lite-v1:free`)
   - Best for: Fast processing
   - Speed: ⚡⚡⚡
   - Accuracy: ⭐⭐

2. **Kat Coder Pro** (`kwaipilot/kat-coder-pro:free`)
   - Best for: High accuracy
   - Speed: ⚡⚡
   - Accuracy: ⭐⭐⭐

3. **Nvidia Nemotron Nano** (`nvidia/nemotron-nano-12b-v2-vl:free`)
   - Best for: Balanced performance
   - Speed: ⚡⚡
   - Accuracy: ⭐⭐⭐

**Features:**
- Sentiment classification (positive/negative/neutral)
- Topic extraction and clustering
- Confidence scoring
- Free tier available

### Jina Reader API
Used for URL content extraction:
- Automatically detects URLs in CSV data
- Extracts clean text content
- Enriches analysis with web content
- Optional feature (works without it)

**Rate Limiting:**
- 10 requests/minute for API compliance
- Automatic retry with exponential backoff
- In-memory caching (1 hour TTL)

## Performance

- Files <1MB: Standard parsing
- Files >1MB: Web Worker parsing
- Cache TTL: 1 hour
- Max file size: 10MB
- Sample size: 1-500 rows (default: 50)
