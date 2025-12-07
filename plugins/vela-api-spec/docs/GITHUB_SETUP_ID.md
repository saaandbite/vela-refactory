# Panduan Setup GitHub Integration - Vela API Spec

Panduan lengkap untuk mengintegrasikan Vela API Spec dengan GitHub repository.

## 📋 Prerequisites

- GitHub account
- Repository untuk menyimpan konfigurasi (bisa public atau private)
- Backstage sudah terinstall dan running

## 🚀 Langkah-langkah Setup

### Step 1: Buat GitHub Repository untuk Template Web

**CATATAN**: Ini adalah repository TERPISAH dari project Backstage Anda!

1. Buka https://github.com/new
2. Buat repository baru, contoh: `vela-web-templates`
3. Pilih Public atau Private sesuai kebutuhan
4. Initialize dengan README (recommended)
5. Klik "Create repository"

**Struktur yang disarankan:**
```
vela-web-templates/
├── README.md
├── configs/
│   ├── sites/
│   ├── pages/
│   └── components/
└── templates/
```

**Contoh README.md:**
```markdown
# Vela Web Templates

Repository untuk menyimpan konfigurasi website yang di-generate oleh Vela API Spec.

## Structure
- `configs/sites/` - Complete site configurations
- `configs/pages/` - Individual page configurations
- `configs/components/` - Reusable component configurations
- `templates/` - Template configurations
```

### Step 2: Generate GitHub Personal Access Token

**PENTING**: Ada 2 repository GitHub yang berbeda:
1. **Repository Project Backstage** (sudah ada) - Menggunakan `GITHUB_TOKEN`
2. **Repository Template Web** (baru) - Menggunakan `VELA_GITHUB_TOKEN`

#### Opsi A: Gunakan Token yang Sama (Recommended untuk Simplicity)

Jika repository template web dalam org/user yang sama dengan project Backstage:
- Gunakan `GITHUB_TOKEN` yang sudah ada
- Token harus punya akses ke kedua repository
- Set `VELA_GITHUB_TOKEN=${GITHUB_TOKEN}` di `.env`

#### Opsi B: Generate Token Baru (Recommended untuk Security)

Jika ingin permission terpisah atau repo di org/user berbeda:

1. Buka https://github.com/settings/tokens
2. Klik **"Generate new token"** → **"Generate new token (classic)"**
3. Beri nama token, contoh: `Vela Web Templates`
4. Set expiration sesuai kebutuhan (recommended: 90 days)
5. Pilih scopes:
   - ✅ `repo` - Full control of private repositories
   - Atau hanya `public_repo` jika repository public
6. Klik **"Generate token"**
7. **PENTING**: Copy token sekarang! Token hanya ditampilkan sekali

### Step 3: Update Environment Variables

Edit file `.env` di root project:

#### Opsi A: Gunakan Token yang Sama

```bash
# GitHub Token untuk Backstage (sudah ada)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Vela API Spec - Gunakan token yang sama
VELA_GITHUB_TOKEN=${GITHUB_TOKEN}
VELA_GITHUB_OWNER=your-github-username
VELA_GITHUB_REPO=vela-web-templates
VELA_GITHUB_BRANCH=main
```

#### Opsi B: Gunakan Token Berbeda

```bash
# GitHub Token untuk Backstage (sudah ada)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Vela API Spec - Token terpisah untuk repo template
VELA_GITHUB_TOKEN=ghp_yyyyyyyyyyyyyyyyyyyyyyyyyyy
VELA_GITHUB_OWNER=your-github-username
VELA_GITHUB_REPO=vela-web-templates
VELA_GITHUB_BRANCH=main
```

**Contoh Lengkap:**
```bash
# ============================================
# GitHub - Backstage Integration (Repo Project)
# ============================================
GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz

# ============================================
# Vela API Spec - GitHub Integration (Repo Template Web)
# ============================================
VELA_GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz
VELA_GITHUB_OWNER=johndoe
VELA_GITHUB_REPO=vela-web-templates
VELA_GITHUB_BRANCH=main
```

**Catatan:**
- `GITHUB_TOKEN` → Untuk Backstage catalog, templates, dll (repo project ini)
- `VELA_GITHUB_TOKEN` → Untuk menyimpan generated configs (repo template web)

### Step 4: Restart Backstage

```bash
# Stop backend jika sedang running (Ctrl+C)

# Restart backend
yarn start
```

### Step 5: Test Integration

#### Test via Browser

1. Buka http://localhost:7007/api/vela-api-spec/github/info
2. Anda akan melihat info repository:
```json
{
  "name": "vela-configs",
  "owner": "johndoe",
  "branch": "main",
  "url": "https://github.com/johndoe/vela-configs"
}
```

#### Test via cURL

```bash
# Test repository info
curl http://localhost:7007/api/vela-api-spec/github/info

# Test list files
curl http://localhost:7007/api/vela-api-spec/github/files
```

#### Test dengan Script

```bash
cd plugins/vela-api-spec/examples
./test-github-integration.sh
```

## 🎯 Cara Menggunakan

### 1. Generate dan Simpan Konfigurasi

```bash
# Generate site config dengan AI
curl -X POST http://localhost:7007/api/vela-api-spec/ai/generate/site-config \
  -H "Content-Type: application/json" \
  -d '{
    "siteName": "My Awesome Site",
    "siteDescription": "A modern website",
    "industry": "Technology",
    "targetAudience": "Developers"
  }' | jq . > generated-config.json

# Simpan ke GitHub
curl -X POST http://localhost:7007/api/vela-api-spec/github/save-config \
  -H "Content-Type: application/json" \
  -d "{
    \"config\": $(cat generated-config.json | jq .data),
    \"filename\": \"configs/my-site.json\",
    \"message\": \"Add my awesome site configuration\"
  }" | jq .
```

### 2. List Konfigurasi yang Ada

```bash
# List semua files di root
curl http://localhost:7007/api/vela-api-spec/github/files | jq .

# List files di folder configs
curl "http://localhost:7007/api/vela-api-spec/github/files?path=configs" | jq .
```

### 3. Load Konfigurasi dari GitHub

```bash
# Get specific config
curl "http://localhost:7007/api/vela-api-spec/github/file?path=configs/my-site.json" | jq .
```

### 4. Update Konfigurasi

```bash
# Get existing config
curl "http://localhost:7007/api/vela-api-spec/github/file?path=configs/my-site.json" > existing.json

# Extract content and SHA
CONTENT=$(cat existing.json | jq -r .content)
SHA=$(cat existing.json | jq -r .sha)

# Update (edit CONTENT as needed)
curl -X POST http://localhost:7007/api/vela-api-spec/github/save \
  -H "Content-Type: application/json" \
  -d "{
    \"path\": \"configs/my-site.json\",
    \"content\": \"$CONTENT\",
    \"message\": \"Update site configuration\",
    \"sha\": \"$SHA\"
  }" | jq .
```

## 📁 Struktur Repository yang Disarankan

Buat struktur folder di repository GitHub Anda:

```
vela-configs/
├── README.md
├── configs/
│   ├── sites/
│   │   ├── landing-page.json
│   │   ├── portfolio.json
│   │   └── blog.json
│   ├── pages/
│   │   ├── home.json
│   │   ├── about.json
│   │   └── contact.json
│   └── components/
│       ├── heroes.json
│       ├── features.json
│       └── ctas.json
└── templates/
    ├── saas-template.json
    └── portfolio-template.json
```

## 🔧 Troubleshooting

### Error: "GitHub integration not configured"

**Penyebab**: Environment variables belum di-set atau salah

**Solusi**:
1. Check file `.env`:
   ```bash
   cat .env | grep VELA_GITHUB
   ```
2. Pastikan semua variabel ada dan benar
3. Restart backend

### Error: "Failed to save file to GitHub: 401"

**Penyebab**: Token tidak valid atau expired

**Solusi**:
1. Generate token baru di GitHub
2. Update `GITHUB_TOKEN` di `.env`
3. Restart backend

### Error: "Failed to save file to GitHub: 403"

**Penyebab**: Token tidak punya permission yang cukup

**Solusi**:
1. Buka https://github.com/settings/tokens
2. Edit token Anda
3. Pastikan scope `repo` atau `public_repo` sudah dicentang
4. Update token di `.env` jika berubah
5. Restart backend

### Error: "Failed to save file to GitHub: 404"

**Penyebab**: Repository tidak ditemukan atau tidak accessible

**Solusi**:
1. Verify repository exists:
   ```bash
   # Ganti dengan owner dan repo Anda
   curl https://api.github.com/repos/your-owner/your-repo
   ```
2. Check `VELA_GITHUB_OWNER` dan `VELA_GITHUB_REPO` di `.env`
3. Pastikan token punya akses ke repository

### Error: "File not found"

**Penyebab**: File path salah atau file belum ada

**Solusi**:
1. List files untuk verify path:
   ```bash
   curl "http://localhost:7007/api/vela-api-spec/github/files?path=configs"
   ```
2. Check case-sensitivity (GitHub paths are case-sensitive)
3. Gunakan path yang benar

## 🔒 Security Tips

1. **Jangan commit `.env` file**
   - Sudah ada di `.gitignore`
   - Gunakan `.env.example` sebagai template

2. **Rotate token secara berkala**
   - Set expiration saat generate token
   - Generate token baru sebelum expired

3. **Gunakan minimal permissions**
   - Public repo → gunakan `public_repo` scope
   - Private repo → gunakan `repo` scope

4. **Protect sensitive configs**
   - Gunakan private repository untuk production configs
   - Set branch protection rules di GitHub

## 📚 Resources

- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Vela API Spec Documentation](../README.md)
- [GitHub Integration Guide](./GITHUB_INTEGRATION.md)

## 🎉 Next Steps

Setelah setup berhasil:

1. ✅ Generate konfigurasi dengan AI
2. ✅ Simpan ke GitHub repository
3. ✅ Share repository dengan tim
4. ✅ Setup CI/CD untuk auto-deploy
5. ✅ Integrate dengan frontend UI

---

**Need Help?** Check dokumentasi lengkap di [GITHUB_INTEGRATION.md](./GITHUB_INTEGRATION.md)
