# GitHub Integration - Vela API Spec

Plugin Vela API Spec sekarang mendukung integrasi dengan GitHub repository untuk menyimpan dan mengelola konfigurasi API yang di-generate.

## 🎯 Fitur

- ✅ Simpan konfigurasi ke GitHub repository
- ✅ Baca konfigurasi dari GitHub repository
- ✅ List files dalam repository
- ✅ Update file yang sudah ada
- ✅ Hapus file dari repository
- ✅ Validasi konfigurasi sebelum disimpan
- ✅ Otomatis handle create/update berdasarkan file existence

## ⚙️ Konfigurasi

### 1. Setup GitHub Token

Buat Personal Access Token (PAT) di GitHub dengan permissions:
- `repo` - Full control of private repositories
- `public_repo` - Access public repositories

Cara membuat token:
1. Buka https://github.com/settings/tokens
2. Klik "Generate new token" → "Generate new token (classic)"
3. Pilih scopes: `repo` atau `public_repo`
4. Generate dan copy token

### 2. Update Environment Variables

Edit file `.env`:

```bash
# GitHub Token (sudah ada untuk Backstage integration)
GITHUB_TOKEN=ghp_your_actual_token_here

# Vela API Spec - GitHub Integration
VELA_GITHUB_OWNER=your_github_username
VELA_GITHUB_REPO=vela-configs
VELA_GITHUB_BRANCH=main
```

### 3. Konfigurasi di app-config.yaml

Konfigurasi sudah ditambahkan di `app-config.yaml`:

```yaml
vela:
  openrouter:
    apiKey: ${OPENROUTER_API_KEY}
  jina:
    apiKey: ${JINA_API_KEY}
  github:
    token: ${GITHUB_TOKEN}
    owner: ${VELA_GITHUB_OWNER}
    repo: ${VELA_GITHUB_REPO}
    branch: ${VELA_GITHUB_BRANCH:main}
```

## 📡 API Endpoints

### 1. Get Repository Info

```bash
GET /api/vela-api-spec/github/info
```

Response:
```json
{
  "name": "vela-configs",
  "owner": "your-username",
  "branch": "main",
  "url": "https://github.com/your-username/vela-configs"
}
```

### 2. List Files

```bash
GET /api/vela-api-spec/github/files?path=configs&branch=main
```

Query Parameters:
- `path` (optional) - Directory path, default: root
- `branch` (optional) - Branch name, default: configured branch

Response:
```json
{
  "files": [
    {
      "name": "site-config.json",
      "path": "configs/site-config.json",
      "type": "file",
      "sha": "abc123..."
    }
  ]
}
```

### 3. Get File Content

```bash
GET /api/vela-api-spec/github/file?path=configs/site-config.json
```

Query Parameters:
- `path` (required) - File path
- `branch` (optional) - Branch name

Response:
```json
{
  "content": "{ ... file content ... }",
  "sha": "abc123...",
  "path": "configs/site-config.json",
  "url": "https://github.com/..."
}
```

### 4. Save File

```bash
POST /api/vela-api-spec/github/save
```

Request Body:
```json
{
  "path": "configs/my-config.json",
  "content": "{ ... your content ... }",
  "message": "Add new configuration",
  "branch": "main",
  "sha": "abc123..."  // Optional, untuk update file yang sudah ada
}
```

Response:
```json
{
  "content": "base64_encoded_content",
  "sha": "new_sha_here",
  "path": "configs/my-config.json",
  "url": "https://github.com/..."
}
```

### 5. Save Generated Config (dengan Validasi)

```bash
POST /api/vela-api-spec/github/save-config
```

Request Body:
```json
{
  "config": {
    "site": { ... },
    "theme": { ... },
    "pages": [ ... ]
  },
  "filename": "configs/site-config.json",
  "message": "Add site configuration",
  "branch": "main"
}
```

Response:
```json
{
  "content": "base64_encoded_content",
  "sha": "new_sha_here",
  "path": "configs/site-config.json",
  "url": "https://github.com/...",
  "validation": {
    "valid": true,
    "errors": [],
    "warnings": []
  }
}
```

### 6. Delete File

```bash
DELETE /api/vela-api-spec/github/file
```

Request Body:
```json
{
  "path": "configs/old-config.json",
  "message": "Remove old configuration",
  "sha": "abc123...",
  "branch": "main"
}
```

Response:
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## 🚀 Contoh Penggunaan

### Workflow 1: Generate dan Simpan ke GitHub

```bash
# 1. Generate site config dengan AI
curl -X POST http://localhost:7007/api/vela-api-spec/ai/generate/site-config \
  -H "Content-Type: application/json" \
  -d '{
    "siteName": "TechFlow",
    "siteDescription": "AI-powered workflow tools",
    "industry": "SaaS",
    "targetAudience": "Developers"
  }' > generated-config.json

# 2. Simpan ke GitHub dengan validasi
curl -X POST http://localhost:7007/api/vela-api-spec/github/save-config \
  -H "Content-Type: application/json" \
  -d '{
    "config": '$(cat generated-config.json | jq .data)',
    "filename": "configs/techflow-site.json",
    "message": "Add TechFlow site configuration"
  }'
```

### Workflow 2: Load dari GitHub dan Update

```bash
# 1. Get existing config
curl "http://localhost:7007/api/vela-api-spec/github/file?path=configs/site.json" \
  > existing-config.json

# 2. Edit config (manual atau dengan AI enhance)
# ... edit file ...

# 3. Update ke GitHub
curl -X POST http://localhost:7007/api/vela-api-spec/github/save \
  -H "Content-Type: application/json" \
  -d '{
    "path": "configs/site.json",
    "content": '$(cat existing-config.json | jq .content)',
    "message": "Update site configuration",
    "sha": '$(cat existing-config.json | jq -r .sha)'
  }'
```

### Workflow 3: List dan Manage Configs

```bash
# List all configs
curl "http://localhost:7007/api/vela-api-spec/github/files?path=configs"

# Get specific config
curl "http://localhost:7007/api/vela-api-spec/github/file?path=configs/site.json"

# Delete old config
curl -X DELETE http://localhost:7007/api/vela-api-spec/github/file \
  -H "Content-Type: application/json" \
  -d '{
    "path": "configs/old-site.json",
    "message": "Remove deprecated config",
    "sha": "abc123..."
  }'
```

## 🎨 Frontend Integration

Untuk menggunakan GitHub integration di frontend plugin (`vela-api-spec-fe`), tambahkan fungsi di API client:

```typescript
// src/api.ts
export class VelaApiSpecClient {
  // ... existing methods ...

  async getGitHubInfo() {
    const response = await fetch(`${this.baseUrl}/github/info`);
    return response.json();
  }

  async listGitHubFiles(path = '', branch?: string) {
    const params = new URLSearchParams();
    if (path) params.append('path', path);
    if (branch) params.append('branch', branch);
    
    const response = await fetch(`${this.baseUrl}/github/files?${params}`);
    return response.json();
  }

  async getGitHubFile(path: string, branch?: string) {
    const params = new URLSearchParams({ path });
    if (branch) params.append('branch', branch);
    
    const response = await fetch(`${this.baseUrl}/github/file?${params}`);
    return response.json();
  }

  async saveToGitHub(data: {
    config: any;
    filename: string;
    message: string;
    branch?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/github/save-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}
```

## 📁 Struktur Repository yang Disarankan

```
vela-configs/
├── configs/
│   ├── sites/
│   │   ├── techflow-site.json
│   │   ├── portfolio-site.json
│   │   └── landing-page.json
│   ├── pages/
│   │   ├── home-page.json
│   │   ├── about-page.json
│   │   └── contact-page.json
│   └── components/
│       ├── hero-sections.json
│       ├── feature-sections.json
│       └── cta-sections.json
├── templates/
│   ├── saas-template.json
│   └── portfolio-template.json
└── README.md
```

## 🔒 Security Best Practices

1. **Token Security**
   - Jangan commit `.env` file ke repository
   - Gunakan environment variables untuk production
   - Rotate token secara berkala

2. **Repository Access**
   - Gunakan private repository untuk konfigurasi sensitif
   - Set proper branch protection rules
   - Review changes sebelum merge

3. **Validation**
   - Selalu gunakan `/github/save-config` endpoint yang include validasi
   - Review validation errors sebelum commit
   - Test konfigurasi sebelum deploy

## 🐛 Troubleshooting

### Error: "GitHub integration not configured"

Pastikan environment variables sudah di-set:
```bash
echo $GITHUB_TOKEN
echo $VELA_GITHUB_OWNER
echo $VELA_GITHUB_REPO
```

### Error: "Failed to save file to GitHub"

1. Check token permissions (harus punya `repo` access)
2. Verify repository exists dan accessible
3. Check branch name (default: `main`)

### Error: "File not found"

1. Verify file path (case-sensitive)
2. Check branch name
3. Ensure file exists di repository

## 📚 Resources

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Creating Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Backstage GitHub Integration](https://backstage.io/docs/integrations/github/locations)

## 🎉 Next Steps

1. Setup GitHub repository untuk configs
2. Configure environment variables
3. Test endpoints dengan curl
4. Integrate dengan frontend UI
5. Setup CI/CD untuk auto-deploy configs
