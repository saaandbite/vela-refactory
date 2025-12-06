# CSV Analyzer - AI-Powered Data Analysis

## Overview

CSV Analyzer adalah fitur baru di VELA Radar yang memungkinkan analisis data CSV menggunakan AI (Google Gemini) untuk sentiment analysis dan topic clustering.

## Fitur Utama

### 1. Upload CSV dengan UI Modern
- **Drag & Drop**: Seret file CSV langsung ke area upload
- **File Validation**: Maksimal 10MB, format CSV only
- **Progress Indicator**: Loading bar saat parsing file
- **Error Handling**: Pesan error yang jelas jika ada masalah

### 2. Parsing Cerdas
- **PapaParse**: Library parsing CSV yang powerful dan cepat
- **Web Worker**: File >1MB diproses di background thread
- **Auto-detection**: Otomatis mendeteksi header dan delimiter

### 3. Tabel Data Interaktif
- **Sorting**: Klik header kolom untuk sort ascending/descending
- **Filtering**: Search box untuk filter data di semua kolom
- **Pagination**: 25/50/100 rows per page
- **Tooltips**: Hover untuk melihat text lengkap yang terpotong

### 4. AI Analysis
- **Sentiment Analysis**: Klasifikasi positive/negative/neutral
- **Topic Clustering**: Identifikasi tema dan keyword utama
- **Configurable Sampling**: Pilih 1-500 rows untuk dianalisis
- **Rate Limiting**: 10 requests/minute untuk compliance

### 5. Visualisasi
- **Pie Chart**: Distribusi sentiment dengan warna
- **Interactive**: Hover untuk detail persentase
- **Auto-update**: Chart update otomatis setelah analysis

## Setup

### 1. Install Dependencies
```bash
yarn workspace @internal/backstage-plugin-vela add papaparse @types/papaparse
```

### 2. Konfigurasi API Key
Tambahkan Gemini API key ke file `.env`:
```bash
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

Dapatkan API key dari: https://makersuite.google.com/app/apikey

### 3. Restart Server
```bash
# Kill port yang sedang digunakan
lsof -ti:7007 | xargs kill -9

# Start ulang
yarn start
```

## Cara Penggunaan

### Step 1: Akses CSV Analyzer
1. Buka aplikasi di http://localhost:3000
2. Navigasi ke **VELA Radar** di sidebar
3. Klik tab **CSV Analyzer**

### Step 2: Upload File CSV
1. Klik area upload atau drag & drop file CSV
2. Tunggu parsing selesai (beberapa detik)
3. Data akan ditampilkan di tabel

### Step 3: Analisis Data
1. **Pilih Text Column**: Kolom yang berisi text untuk dianalisis
2. **Set Sample Size**: Jumlah rows (default: 50)
3. **Klik Analyze Sentiment**: Untuk sentiment analysis
4. **Klik Analyze Topics**: Untuk topic clustering
5. Tunggu 5-10 detik untuk hasil

### Step 4: Lihat Hasil
- **Pie Chart**: Muncul di atas tabel
- **Sentiment Distribution**: Positive/Negative/Neutral
- **Topic List**: Tema utama dengan keywords

## Format CSV yang Didukung

### Contoh CSV untuk Sentiment Analysis
```csv
id,text,date
1,"Product ini sangat bagus dan berkualitas!",2024-01-01
2,"Pelayanan mengecewakan, tidak recommended",2024-01-02
3,"Harga standar, kualitas biasa saja",2024-01-03
```

### Contoh CSV untuk Topic Analysis
```csv
feedback_id,customer_feedback,category
1,"Aplikasi sering crash saat digunakan",Technical
2,"Fitur pembayaran sangat membantu",Feature
3,"Customer service responsif dan helpful",Service
```

## Performance Tips

### Untuk File Besar (>1MB)
- Web Worker otomatis aktif
- Parsing di background thread
- UI tetap responsive

### Untuk Analysis Cepat
- Gunakan sample size kecil (50-100 rows)
- Cache otomatis menyimpan hasil 1 jam
- Rate limiter mencegah API overload

### Untuk Akurasi Tinggi
- Gunakan sample size besar (200-500 rows)
- Pilih kolom text yang informatif
- Pastikan data clean (no empty cells)

## Troubleshooting

### Error: "File size exceeds 10MB limit"
**Solusi**: Compress atau split file CSV menjadi lebih kecil

### Error: "Failed to analyze sentiment"
**Solusi**: 
1. Check API key di `.env`
2. Pastikan ada koneksi internet
3. Cek quota Gemini API

### Error: "Please select a CSV file"
**Solusi**: Pastikan file berekstensi `.csv`, bukan `.xlsx` atau `.txt`

### Tabel Tidak Muncul
**Solusi**:
1. Refresh browser
2. Check console untuk error
3. Pastikan CSV format valid

### Analysis Lambat
**Solusi**:
1. Kurangi sample size
2. Check koneksi internet
3. Tunggu rate limiter (max 10 req/min)

## Architecture

```
CSVAnalyzer/
├── components/
│   ├── CSVUploader.tsx       # Upload UI dengan drag & drop
│   ├── DataTable.tsx         # Table dengan sort/filter
│   ├── AnalysisControls.tsx  # Control panel untuk analysis
│   └── SentimentChart.tsx    # Pie chart visualization
├── services/
│   └── geminiService.ts      # Gemini API integration
├── workers/
│   └── csvParser.worker.ts   # Web Worker untuk parsing
├── utils/
│   ├── cache.ts              # In-memory cache (1h TTL)
│   └── rateLimiter.ts        # Rate limiting (10/min)
└── types.ts                  # TypeScript interfaces
```

## API Integration

### Gemini API Endpoints
- **Model**: gemini-pro
- **Endpoint**: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
- **Rate Limit**: 10 requests/minute
- **Retry**: 3x dengan exponential backoff

### Request Format
```typescript
{
  contents: [{
    parts: [{
      text: "Analyze sentiment: [texts...]"
    }]
  }]
}
```

### Response Format
```typescript
{
  candidates: [{
    content: {
      parts: [{
        text: '[{"text":"...", "sentiment":"positive", "score":0.9}]'
      }]
    }
  }]
}
```

## Best Practices

### 1. Data Preparation
- Clean data sebelum upload
- Remove empty rows
- Consistent column names
- UTF-8 encoding

### 2. Analysis Strategy
- Start dengan sample kecil untuk testing
- Increase sample size untuk production
- Monitor API quota usage
- Cache results untuk reuse

### 3. Performance
- Use Web Worker untuk file besar
- Enable caching untuk repeated queries
- Respect rate limits
- Optimize sample size

## Future Enhancements

- [ ] Export hasil analysis ke CSV/JSON
- [ ] Multiple file upload
- [ ] Custom sentiment categories
- [ ] Advanced topic modeling
- [ ] Real-time streaming analysis
- [ ] Integration dengan database
- [ ] Scheduled analysis jobs
- [ ] Email notifications

## Support

Untuk pertanyaan atau issue:
1. Check dokumentasi ini
2. Review error messages
3. Check browser console
4. Contact team VELA
