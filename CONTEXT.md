# 🏗️ Project Context: Dynamic Site Generator Protocol

**Project:** Digital Agency Dynamic Platform
**Role A (API Specialist):** Spec & Data Structure
**Role B (Template Architect):** Component Engine & UI Implementation

---

## 🎯 1. Core Philosophy (The Vibe)

Project ini menganut arsitektur **Server-Driven UI (SDUI)** sederhana.

- **API** adalah "Otak" yang menentukan konten, urutan, warna, dan struktur halaman.
- **Template** adalah "Tangan" yang merender komponen berdasarkan instruksi API.

**Rule #1:** Template tidak boleh _hardcode_ teks atau warna. Semua harus consume dari JSON response.
**Rule #2:** Jika API mengirim `type: "hero"`, Template wajib merender komponen Hero.

---

## 📐 2. The Global Schema (Data Structure)

API akan mengembalikan satu objek JSON besar (Monolithic Config) atau endpoint terpisah yang dipersatukan oleh struktur berikut.

### Root Response Structure

Setiap request ke endpoint `/api/site-config` harus mengembalikan format ini:

```json
{
  "site": {
    "title": "String",
    "description": "String",
    "favicon": "UrlString"
  },
  "theme": {
    "primary": "HexColor",
    "secondary": "HexColor",
    "background": "HexColor",
    "text": "HexColor",
    "mode": "light | dark"
  },
  "navigation": [{ "label": "String", "path": "String (URL/Anchor)" }],
  "pages": [
    {
      "path": "String (e.g., / or /about)",
      "sections": [
        /* Array of Component Objects (Lihat Section 3) */
      ]
    }
  ]
}
```

## 🧩 3. Component Library Standard (The "Atomic Units")

Template Builder harus menyiapkan komponen React/Vue/Svelte yang siap menerima props berikut. API wajib mengirim data sesuai struktur ini.

### A. Component: Hero

Trigger: `type: "hero"`

```json
{
  "type": "hero",
  "content": {
    "title": "String",
    "subtitle": "String",
    "description": "String",
    "backgroundImage": "UrlString",
    "cta": {
      "text": "String",
      "href": "String",
      "variant": "primary | secondary"
    }
  }
}
```

### B. Component: Features

Trigger: `type: "features"`

```json
{
  "type": "features",
  "content": {
    "title": "String",
    "subtitle": "String",
    "features": [
      {
        "title": "String",
        "description": "String",
        "icon": "IconName (e.g., 'sparkles', 'globe')",
        "image": "UrlString (Optional)"
      }
    ]
  }
}
```

### C. Component: Grid (Projects/Portfolio)

Trigger: `type: "grid"`

```json
{
  "type": "grid",
  "content": {
    "title": "String",
    "subtitle": "String",
    "columns": "Number (e.g., 3)",
    "items": [
      {
        "title": "String",
        "description": "String",
        "icon": "IconName",
        "link": "UrlString"
      }
    ]
  }
}
```

### D. Component: Stats

Trigger: `type: "stats"`

```json
{
  "type": "stats",
  "content": {
    "title": "String",
    "layout": "grid | row",
    "background": "default | gradient",
    "stats": [
      {
        "label": "String",
        "value": "String",
        "icon": "IconName"
      }
    ]
  }
}
```

### E. Component: Team

Trigger: `type: "team"`

```json
{
  "type": "team",
  "content": {
    "title": "String",
    "subtitle": "String",
    "columns": "Number",
    "members": [
      {
        "name": "String",
        "role": "String",
        "avatar": "UrlString",
        "bio": "String",
        "social": [
          { "platform": "linkedin | twitter | github", "url": "UrlString" }
        ]
      }
    ]
  }
}
```

### F. Component: Testimonials

Trigger: `type: "testimonials"`

```json
{
  "type": "testimonials",
  "content": {
    "title": "String",
    "subtitle": "String",
    "testimonials": [
      {
        "name": "String",
        "role": "String",
        "avatar": "UrlString",
        "content": "String",
        "rating": "Number (1-5)"
      }
    ]
  }
}
```

## 🎨 4. Implementation Guidelines

### Untuk API Spec Creator (Backend/AI)

**Strict Typing:** Pastikan type string persis sama (lowercase). Jangan kirim Hero jika kontraknya hero.

**Null Safety:** Jika ada field optional (misal gambar), pastikan Template bisa handle jika API mengirim null atau string kosong.

**Iconography:** Gunakan set standar (misal: Lucide React atau FontAwesome names). Sepakati library ikon apa yang dipakai.

### Untuk Template Builder (Frontend)

**Dynamic Renderer:** Buat satu komponen utama (misal `<PageBuilder />`) yang melakukan mapping:

```javascript
// Pseudocode concept
{
  sectionData.map(section => {
    switch (section.type) {
      case 'hero':
        return <Hero {...section.content} />;
      case 'features':
        return <Features {...section.content} />;
      // ...
    }
  });
}
```

**Theme Injection:** Gunakan value dari theme object di JSON untuk meng-override CSS Variables di `:root` saat runtime.

`theme.primary` -> `--color-primary`

`theme.text` -> `--color-text`

## 🧪 5. Sample Valid JSON Payload

(Generated from the provided YAML context)

```json
{
  "site": {
    "title": "Pixel Perfect Studio",
    "description": "Award-winning digital agency..."
  },
  "theme": {
    "primary": "#f59e0b",
    "mode": "light"
  },
  "pages": [
    {
      "path": "/",
      "sections": [
        {
          "type": "hero",
          "content": {
            "title": "We Create Digital Experiences That Matter",
            "cta": { "text": "Start Your Project", "variant": "primary" }
            // ... fields lainnya
          }
        },
        {
          "type": "features",
          "content": {
            "title": "Our Services",
            "features": [
              /* ... array features ... */
            ]
          }
        }
      ]
    }
  ]
}
```
