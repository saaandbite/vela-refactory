# VELA Backstage Platform

Platform internal developer portal berbasis Backstage dengan fitur AI-powered data analysis.

## 🚀 Quick Start

```sh
yarn install
yarn start
```

Aplikasi akan berjalan di:
- Frontend: http://localhost:3000
- Backend: http://localhost:7007

## ✨ Features

### VELA Radar - Data Intelligence Module

#### 1. Web-to-Spec Scraper
- Scrape website content menggunakan Jina Reader API
- Extract structured data untuk spec generation
- URL validation dan error handling

#### 2. CSV Analyzer (NEW! 🎉)
- **AI-Powered Analysis** dengan Google Gemini
- **Sentiment Analysis** - Klasifikasi positive/negative/neutral
- **Topic Clustering** - Identifikasi tema dan keywords
- **Interactive UI** - Drag & drop upload, sort, filter, pagination
- **Smart Parsing** - Web Worker untuk file besar (>1MB)
- **Visualization** - Pie chart dengan Recharts
- **Performance** - Caching (1h TTL) & rate limiting (10/min)

#### 3. Data Dashboard
- Visualisasi hasil analysis
- Charts dan metrics

## 📊 CSV Analyzer Setup

### 1. Install Dependencies
```bash
yarn workspace @internal/backstage-plugin-vela add papaparse @types/papaparse
```

### 2. Configure API Key
Edit `.env` file:
```bash
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

Get free API key: https://makersuite.google.com/app/apikey

### 3. Test with Sample Data
```bash
# Sample CSV tersedia di:
examples/sample-data.csv
```

### 4. Usage
1. Navigate to **VELA Radar** → **CSV Analyzer**
2. Upload CSV file (max 10MB)
3. Select text column to analyze
4. Click **Analyze Sentiment** or **Analyze Topics**
5. View results in pie chart and table

## 📚 Documentation

- [CSV Analyzer Guide](./AI-Agent/CSV-Analyzer.md) - Comprehensive documentation
- [Quick Start Guide](./QUICK_START_CSV_ANALYZER.md) - Get started in 3 steps
- [Jina Integration](./AI-Agent/Jina.md) - Web scraping setup
- [Agents Overview](./AI-Agent/AGENTS.md) - AI agents documentation

## 🛠️ Tech Stack

- **Frontend**: React, Material-UI, Recharts
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **AI/ML**: Google Gemini API
- **Parsing**: PapaParse
- **Scraping**: Jina Reader API

## 🔧 Troubleshooting

### Port Already in Use
```bash
lsof -ti:7007 | xargs kill -9
yarn start
```

### CSV Upload Issues
- Max file size: 10MB
- Supported format: .csv only
- Encoding: UTF-8

### API Key Issues
- Ensure key starts with `REACT_APP_`
- Restart server after editing `.env`
- Check API quota at Google Cloud Console

## 📦 Project Structure

```
vela-backstages/
├── packages/
│   ├── app/              # Frontend application
│   └── backend/          # Backend services
├── plugins/
│   ├── vela/             # VELA Radar plugin
│   │   └── src/
│   │       └── components/
│   │           └── Radar/
│   │               ├── CSVAnalyzer/    # CSV analysis features
│   │               ├── WebToSpec/      # Web scraping
│   │               └── Dashboard/      # Data visualization
│   └── vela-backend/     # Backend plugin
├── examples/
│   └── sample-data.csv   # Sample CSV for testing
└── AI-Agent/             # Documentation
```

## 🎯 Roadmap

- [x] CSV upload with drag & drop
- [x] Sentiment analysis with AI
- [x] Topic clustering
- [x] Interactive data table
- [x] Visualization with charts
- [ ] Export analysis results
- [ ] Multiple file upload
- [ ] Real-time streaming analysis
- [ ] Database integration
- [ ] Scheduled analysis jobs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Apache-2.0

## 🙏 Acknowledgments

- [Backstage](https://backstage.io) - Developer portal platform
- [Google Gemini](https://ai.google.dev) - AI analysis
- [PapaParse](https://www.papaparse.com) - CSV parsing
- [Jina AI](https://jina.ai) - Web scraping
- [Recharts](https://recharts.org) - Data visualization
