# VELA Radar - AI Agent Documentation

## Overview

VELA Radar adalah platform AI-powered untuk data analysis, web scraping, dan spec-driven development. Platform ini mengintegrasikan berbagai AI services (OpenRouter, Jina AI) untuk memberikan workflow yang seamless dari data extraction hingga technical specification generation.

## Fitur Utama

### 1. 📊 CSV Analyzer
AI-powered sentiment analysis dan topic clustering untuk data CSV.

**Key Features:**
- Upload CSV dengan drag & drop
- Sentiment analysis (positive/negative/neutral)
- Topic clustering dengan keywords
- Interactive charts dan visualizations
- Export ke PDF
- Multi-language support (Indonesian, English)
- Auto-select text columns
- Batching untuk dataset besar

**Use Cases:**
- Customer feedback analysis
- Social media sentiment tracking
- Survey data analysis
- Product review analysis

[📖 Full Documentation](./CSV-Analyzer.md)

### 2. 🌐 Web Content Analyzer
Scrape dan analyze konten web dengan AI, output dalam CSV, Summary, dan Visualization.

**Key Features:**
- URL scraping dengan Jina Reader
- AI-powered content extraction
- Data cleaning dan normalization
- CSV export dengan structured data
- Summary generation
- Visual insights
- Integration dengan OpenSpec Generator

**Use Cases:**
- Competitive analysis
- Content research
- Data collection
- Market research
- Product feature extraction

[📖 Full Documentation](./Web-Content-Analyzer.md)

### 3. 📝 OpenSpec Generator
Spec-driven development dengan AI - generate Requirements, Design, dan Tasks dari content.

**Key Features:**
- Three-phase workflow (Requirements → Design → Tasks)
- AI-powered spec generation
- EARS format requirements
- Technical architecture design
- Implementation task breakdown
- PDF export
- Integration dengan Web Content Analyzer

**Use Cases:**
- New feature planning
- Technical documentation
- Project scoping
- Team alignment
- Reverse engineering

[📖 Full Documentation](./OpenSpec-Generator.md)

### 4. 🔍 Jina AI Integration
Comprehensive integration dengan Jina AI APIs untuk content extraction dan enrichment.

**Available APIs:**
- Reader API (web scraping)
- Embeddings API
- Reranker API
- Search API
- Segmenter API
- Classifier API
- DeepSearch API

[📖 Full Documentation](./Jina.md)

## Quick Start

### Prerequisites
```bash
# Node.js 18+
node --version

# Yarn
yarn --version
```

### Installation
```bash
# Clone repository
git clone https://github.com/saaandbite/vela-refactory.git
cd vela-refactory

# Install dependencies
yarn install

# Setup environment variables
cp .env.example .env
# Edit .env dengan API keys
```

### Configuration
File: `.env`
```bash
# OpenRouter API (untuk AI analysis)
OPENROUTER_API_KEY=sk-or-v1-your_key_here

# Jina AI API (untuk web scraping)
JINA_API_KEY=jina_your_key_here
```

Get API keys:
- OpenRouter: https://openrouter.ai/keys
- Jina AI: https://jina.ai/

### Running the Application
```bash
# Development mode
yarn dev

# Production build
yarn build
yarn start

# Backend only
yarn start-backend

# Frontend only
yarn start --filter=app
```

### Access
- Frontend: http://localhost:3000
- Backend: http://localhost:7007
- VELA Radar: http://localhost:3000/vela/radar

## Architecture

```
vela-backstages/
├── packages/
│   ├── app/                      # Frontend application
│   └── backend/                  # Backend services
├── plugins/
│   ├── vela/                     # Frontend plugin
│   │   └── src/
│   │       └── components/
│   │           └── Radar/
│   │               ├── CSVAnalyzer/
│   │               ├── WebContentAnalyzer/
│   │               └── OpenSpec/
│   └── vela-backend/             # Backend plugin
│       └── src/
│           └── service/
│               └── modules/
│                   └── radar/
│                       ├── DataAnalyzer.ts
│                       ├── ContentAnalyzer.ts
│                       ├── SpecGenerator.ts
│                       └── JinaReader.ts
├── examples/
│   └── sample-data.csv           # Sample CSV untuk testing
└── AI-Agent/                     # Documentation
    ├── README.md                 # This file
    ├── CSV-Analyzer.md
    ├── Web-Content-Analyzer.md
    ├── OpenSpec-Generator.md
    └── Jina.md
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI
- **Charts**: Recharts
- **CSV Parsing**: PapaParse
- **PDF Export**: jsPDF
- **State Management**: React Hooks
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express (via Backstage)
- **Language**: TypeScript
- **API Client**: Fetch API
- **Config**: Backstage Config API

### AI Services
- **OpenRouter**: Multi-model AI access
  - Amazon Nova Lite (Fast)
  - Kat Coder Pro (Accurate)
  - Nemotron Nano (Balanced)
- **Jina AI**: Web scraping dan embeddings

### Development Tools
- **Build**: Yarn Workspaces
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript

## Workflow Examples

### Workflow 1: Customer Feedback Analysis
```
1. Upload CSV dengan customer feedback
   ↓
2. Select "feedback" column
   ↓
3. Choose Amazon Nova Lite model
   ↓
4. Click "Analyze Sentiment"
   ↓
5. View pie chart (positive/negative/neutral)
   ↓
6. Click "Analyze Topics"
   ↓
7. View topic clusters dengan keywords
   ↓
8. Export to PDF
```

### Workflow 2: Competitive Analysis
```
1. Go to Web Content Analyzer
   ↓
2. Input competitor product URL
   ↓
3. Click "Extract & Analyze"
   ↓
4. Review CSV data (features, pricing, etc.)
   ↓
5. Read summary insights
   ↓
6. Click "Generate Technical Spec"
   ↓
7. OpenSpec generates requirements
   ↓
8. Generate design dan tasks
   ↓
9. Export complete specification
```

### Workflow 3: Feature Planning
```
1. Write feature description
   ↓
2. Paste to OpenSpec Generator
   ↓
3. Generate requirements (user stories)
   ↓
4. Review dengan team
   ↓
5. Generate technical design
   ↓
6. Review architecture
   ↓
7. Generate implementation tasks
   ↓
8. Assign tasks to developers
   ↓
9. Export PDF untuk documentation
```

## API Integration

### OpenRouter API
**Purpose**: Multi-model AI access untuk analysis dan generation

**Endpoints**:
- `POST /api/v1/chat/completions`

**Models**:
- `amazon/nova-2-lite-v1:free` - Fast, recommended
- `kwaipilot/kat-coder-pro:free` - Accurate
- `nvidia/nemotron-nano-12b-v2-vl:free` - Balanced

**Rate Limits**:
- Frontend: 10 requests/minute
- Backend: Per OpenRouter limits

### Jina AI API
**Purpose**: Web scraping, embeddings, search

**Endpoints**:
- `POST https://r.jina.ai/` - Reader API
- `POST https://api.jina.ai/v1/embeddings` - Embeddings
- `POST https://api.jina.ai/v1/rerank` - Reranker
- `POST https://s.jina.ai/` - Search API

**Features**:
- Clean content extraction
- Multi-format support
- Image handling
- Link extraction

## Best Practices

### 1. API Key Management
```bash
# ✅ DO: Use environment variables
OPENROUTER_API_KEY=sk-or-v1-xxx

# ❌ DON'T: Hardcode keys
const apiKey = "sk-or-v1-xxx"; // NEVER!

# ✅ DO: Add to .gitignore
echo ".env" >> .gitignore

# ✅ DO: Rotate keys regularly
# Every 90 days or after exposure
```

### 2. Error Handling
```typescript
// ✅ DO: Comprehensive error handling
try {
  const result = await analyzeData(data);
  return result;
} catch (error) {
  console.error('Analysis failed:', error);
  showUserFriendlyError(error);
  logToMonitoring(error);
}

// ❌ DON'T: Silent failures
const result = await analyzeData(data).catch(() => null);
```

### 3. Performance
```typescript
// ✅ DO: Batch large datasets
if (data.length > 20) {
  return processBatches(data, 20);
}

// ✅ DO: Use appropriate sample sizes
const sampleSize = Math.min(data.length, 50);

// ❌ DON'T: Process everything at once
await analyzeAll(hugeDataset); // May timeout!
```

### 4. User Experience
```typescript
// ✅ DO: Show progress
setLoading(true);
setProgress(0);
for (let i = 0; i < batches.length; i++) {
  await processBatch(batches[i]);
  setProgress((i + 1) / batches.length * 100);
}
setLoading(false);

// ✅ DO: Provide feedback
showSuccess('Analysis completed!');
showError('Failed to analyze. Please try again.');
```

## Troubleshooting

### Common Issues

#### 1. API Key Errors
**Symptoms**: "API key not configured" atau "Unauthorized"

**Solutions**:
- Check `.env` file exists
- Verify key format (starts with `sk-or-v1-` for OpenRouter)
- Restart backend after changing `.env`
- Check key hasn't expired

#### 2. Backend Not Running
**Symptoms**: "Failed to fetch" atau "Network error"

**Solutions**:
```bash
# Check if backend is running
curl http://localhost:7007/api/vela-backend/health

# Restart backend
yarn start-backend

# Check logs
tail -f logs/backend.log
```

#### 3. Slow Performance
**Symptoms**: Analysis takes >30 seconds

**Solutions**:
- Reduce sample size (50 → 20)
- Use faster model (Nova Lite)
- Check internet connection
- Monitor API rate limits

#### 4. Empty Results
**Symptoms**: Charts show "No data available"

**Solutions**:
- Check console logs (F12)
- Verify correct column selected
- Ensure data is not empty
- Try different AI model
- Check backend logs

### Debug Mode

Enable comprehensive logging:

**Frontend**:
```typescript
// Already enabled in code
console.log('🔍 Debug info:', data);
```

**Backend**:
```typescript
// Check backend logs
console.log('🔵 Backend processing:', request);
```

**Browser Console**:
```
F12 → Console tab
Filter: "🔍" or "📊" or "✅"
```

## Performance Metrics

### Expected Performance

| Operation | Time | Notes |
|-----------|------|-------|
| CSV Upload | <1s | Up to 10MB |
| CSV Parsing | 1-3s | 1000 rows |
| Sentiment Analysis | 5-15s | 50 texts |
| Topic Analysis | 5-15s | 50 texts |
| Web Scraping | 2-5s | Per URL |
| Content Analysis | 10-20s | Per page |
| Spec Generation | 10-30s | Per phase |
| PDF Export | 1-3s | Full spec |

### Optimization Tips

1. **Reduce Sample Size**: 50 → 20 texts
2. **Use Faster Model**: Switch to Nova Lite
3. **Enable Caching**: For repeated queries
4. **Batch Processing**: Automatic for >20 items
5. **Parallel Requests**: Where applicable

## Security

### Data Privacy
- ✅ No permanent storage
- ✅ In-memory processing only
- ✅ HTTPS for all API calls
- ✅ API keys in environment variables
- ✅ No logging of sensitive data

### API Security
- ✅ Rate limiting (10 req/min)
- ✅ Input validation
- ✅ Error sanitization
- ✅ CORS configuration
- ✅ Authentication (optional)

### Best Practices
```bash
# Rotate API keys regularly
# Every 90 days

# Monitor usage
# Check OpenRouter dashboard

# Audit logs
# Review backend logs weekly

# Update dependencies
yarn upgrade-interactive
```

## Contributing

### Development Workflow
```bash
# 1. Create feature branch
git checkout -b feature/new-analyzer

# 2. Make changes
# Edit code...

# 3. Test locally
yarn test
yarn lint

# 4. Commit
git add .
git commit -m "feat: add new analyzer"

# 5. Push
git push origin feature/new-analyzer

# 6. Create PR
# Via GitHub UI
```

### Code Style
- TypeScript strict mode
- ESLint rules
- Prettier formatting
- Meaningful variable names
- Comprehensive comments

### Testing
```bash
# Run tests
yarn test

# Run specific test
yarn test CSVAnalyzer

# Coverage
yarn test --coverage
```

## Roadmap

### Q1 2024
- [x] CSV Analyzer
- [x] Web Content Analyzer
- [x] OpenSpec Generator
- [x] Jina AI Integration
- [x] PDF Export

### Q2 2024
- [ ] Batch URL processing
- [ ] Custom AI prompts
- [ ] Template library
- [ ] Collaborative editing
- [ ] Version history

### Q3 2024
- [ ] Database integration
- [ ] Scheduled jobs
- [ ] Webhook notifications
- [ ] Advanced analytics
- [ ] Mobile app

### Q4 2024
- [ ] Enterprise features
- [ ] SSO integration
- [ ] Audit logs
- [ ] Custom models
- [ ] API marketplace

## Support

### Documentation
- [CSV Analyzer](./CSV-Analyzer.md)
- [Web Content Analyzer](./Web-Content-Analyzer.md)
- [OpenSpec Generator](./OpenSpec-Generator.md)
- [Jina AI](./Jina.md)

### Resources
- GitHub: https://github.com/saaandbite/vela-refactory
- OpenRouter Docs: https://openrouter.ai/docs
- Jina AI Docs: https://jina.ai/docs

### Contact
- Team Slack: #vela-radar
- Email: support@vela.ai
- Issues: GitHub Issues

## License

[Add your license information here]

## Acknowledgments

- OpenRouter for multi-model AI access
- Jina AI for web scraping capabilities
- Backstage for platform foundation
- Open source community

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainers**: VELA Team
