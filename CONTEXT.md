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
    "favicon": "UrlString",
    "logo": "UrlString (Optional)",
    "keywords": "String (Optional, SEO)",
    "author": "String (Optional)",
    "language": "String (Optional, e.g., 'id', 'en')"
  },
  "theme": {
    "primary": "HexColor",
    "secondary": "HexColor",
    "accent": "HexColor (Optional)",
    "background": "HexColor",
    "surface": "HexColor (Optional, for cards/panels)",
    "text": "HexColor",
    "textSecondary": "HexColor (Optional)",
    "border": "HexColor (Optional)",
    "success": "HexColor (Optional)",
    "warning": "HexColor (Optional)",
    "error": "HexColor (Optional)",
    "mode": "light | dark",
    "borderRadius": "String (Optional, e.g., '8px', '16px')",
    "fontFamily": "String (Optional, e.g., 'Inter', 'Poppins')",
    "fontSize": {
      "base": "String (Optional)",
      "heading": "String (Optional)"
    }
  },
  "navbar": {
    "type": "sticky | fixed | static (Optional, default: static)",
    "transparent": "Boolean (Optional)",
    "showLogo": "Boolean (Optional, default: true)",
    "logo": {
      "image": "UrlString (Optional)",
      "text": "String (Optional)",
      "link": "String (Optional, default: '/')"
    },
    "links": [
      {
        "label": "String",
        "path": "String",
        "type": "link | dropdown | button (Optional, default: link)",
        "icon": "IconName (Optional)",
        "children": [
          {
            "label": "String",
            "path": "String",
            "icon": "IconName (Optional)"
          }
        ]
      }
    ],
    "cta": {
      "text": "String (Optional)",
      "href": "String (Optional)",
      "variant": "primary | secondary | outline (Optional)",
      "icon": "IconName (Optional)"
    },
    "search": {
      "enabled": "Boolean (Optional)",
      "placeholder": "String (Optional)"
    },
    "social": [
      {
        "platform": "String (e.g., 'linkedin', 'twitter')",
        "url": "UrlString",
        "icon": "IconName (Optional)"
      }
    ]
  },
  "footer": {
    "layout": "columns | centered | minimal (Optional, default: columns)",
    "showLogo": "Boolean (Optional, default: true)",
    "logo": {
      "image": "UrlString (Optional)",
      "text": "String (Optional)"
    },
    "tagline": "String (Optional)",
    "sections": [
      {
        "title": "String",
        "links": [
          {
            "label": "String",
            "path": "String",
            "icon": "IconName (Optional)",
            "external": "Boolean (Optional)"
          }
        ]
      }
    ],
    "social": [
      {
        "platform": "String (e.g., 'facebook', 'instagram', 'linkedin')",
        "url": "UrlString",
        "icon": "IconName (Optional)"
      }
    ],
    "contact": {
      "email": "String (Optional)",
      "phone": "String (Optional)",
      "address": "String (Optional)"
    },
    "newsletter": {
      "enabled": "Boolean (Optional)",
      "title": "String (Optional)",
      "description": "String (Optional)",
      "placeholder": "String (Optional)",
      "buttonText": "String (Optional)"
    },
    "bottom": {
      "copyright": "String",
      "links": [
        {
          "label": "String",
          "path": "String"
        }
      ]
    },
    "background": "default | gradient | image (Optional)",
    "backgroundImage": "UrlString (Optional)"
  },
  "pages": [
    {
      "path": "String (e.g., / or /about)",
      "title": "String (Optional, page title)",
      "description": "String (Optional, meta description)",
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
    "subtitle": "String (Optional)",
    "description": "String (Optional)",
    "height": "full | medium | small (Optional, default: full)",
    "alignment": "left | center | right (Optional, default: center)",
    "backgroundImage": "UrlString (Optional)",
    "backgroundVideo": "UrlString (Optional)",
    "overlay": {
      "enabled": "Boolean (Optional)",
      "color": "HexColor (Optional)",
      "opacity": "Number 0-1 (Optional)"
    },
    "image": {
      "url": "UrlString (Optional)",
      "position": "left | right (Optional)",
      "alt": "String (Optional)"
    },
    "badges": [
      {
        "text": "String",
        "icon": "IconName (Optional)",
        "variant": "primary | secondary | success (Optional)"
      }
    ],
    "cta": {
      "text": "String",
      "href": "String",
      "variant": "primary | secondary | outline (Optional)",
      "icon": "IconName (Optional)",
      "size": "small | medium | large (Optional)"
    },
    "secondaryCta": {
      "text": "String (Optional)",
      "href": "String (Optional)",
      "variant": "link | outline (Optional)",
      "icon": "IconName (Optional)"
    },
    "features": [
      {
        "text": "String",
        "icon": "IconName (Optional)"
      }
    ],
    "animation": "fade | slide | none (Optional, default: fade)"
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
    "subtitle": "String (Optional)",
    "description": "String (Optional)",
    "layout": "grid | list | carousel (Optional, default: grid)",
    "columns": "Number (Optional, 2-4, default: 3)",
    "alignment": "left | center (Optional, default: center)",
    "background": "default | gradient | colored (Optional)",
    "features": [
      {
        "title": "String",
        "description": "String",
        "icon": "IconName (Optional, e.g., 'sparkles', 'globe')",
        "iconColor": "HexColor (Optional)",
        "image": "UrlString (Optional)",
        "link": {
          "text": "String (Optional)",
          "href": "String (Optional)"
        },
        "stats": {
          "value": "String (Optional)",
          "label": "String (Optional)"
        },
        "badge": {
          "text": "String (Optional)",
          "variant": "primary | success | warning (Optional)"
        }
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
    "subtitle": "String (Optional)",
    "description": "String (Optional)",
    "columns": "Number (Optional, 2-4, default: 3)",
    "gap": "small | medium | large (Optional, default: medium)",
    "style": "card | minimal | overlay (Optional, default: card)",
    "filter": {
      "enabled": "Boolean (Optional)",
      "categories": ["String (Optional)"]
    },
    "items": [
      {
        "title": "String",
        "description": "String (Optional)",
        "category": "String (Optional)",
        "tags": ["String (Optional)"],
        "icon": "IconName (Optional)",
        "image": "UrlString (Optional)",
        "thumbnail": "UrlString (Optional)",
        "link": "UrlString (Optional)",
        "date": "String (Optional)",
        "author": {
          "name": "String (Optional)",
          "avatar": "UrlString (Optional)"
        },
        "stats": [
          {
            "label": "String",
            "value": "String",
            "icon": "IconName (Optional)"
          }
        ],
        "badges": [
          {
            "text": "String",
            "variant": "primary | success | warning (Optional)"
          }
        ],
        "cta": {
          "text": "String (Optional)",
          "href": "String (Optional)"
        }
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
    "title": "String (Optional)",
    "subtitle": "String (Optional)",
    "layout": "grid | row | compact (Optional, default: grid)",
    "columns": "Number (Optional, 2-5, default: 4)",
    "background": "default | gradient | colored (Optional)",
    "backgroundImage": "UrlString (Optional)",
    "size": "small | medium | large (Optional, default: medium)",
    "stats": [
      {
        "label": "String",
        "value": "String",
        "prefix": "String (Optional, e.g., '$', '+')",
        "suffix": "String (Optional, e.g., '%', 'K')",
        "icon": "IconName (Optional)",
        "iconColor": "HexColor (Optional)",
        "description": "String (Optional)",
        "trend": {
          "value": "Number (Optional)",
          "direction": "up | down (Optional)",
          "label": "String (Optional)"
        },
        "animation": "count | fade | slide (Optional)"
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
    "subtitle": "String (Optional)",
    "description": "String (Optional)",
    "layout": "grid | carousel | list (Optional, default: grid)",
    "columns": "Number (Optional, 2-4, default: 3)",
    "style": "card | minimal | overlay (Optional, default: card)",
    "members": [
      {
        "name": "String",
        "role": "String",
        "department": "String (Optional)",
        "avatar": "UrlString",
        "coverImage": "UrlString (Optional)",
        "bio": "String (Optional)",
        "email": "String (Optional)",
        "phone": "String (Optional)",
        "location": "String (Optional)",
        "skills": ["String (Optional)"],
        "achievements": [
          {
            "title": "String (Optional)",
            "description": "String (Optional)"
          }
        ],
        "social": [
          {
            "platform": "linkedin | twitter | github | instagram | dribbble | behance",
            "url": "UrlString",
            "icon": "IconName (Optional)"
          }
        ],
        "badge": {
          "text": "String (Optional)",
          "variant": "primary | success (Optional)"
        },
        "featured": "Boolean (Optional)"
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
    "subtitle": "String (Optional)",
    "description": "String (Optional)",
    "layout": "grid | carousel | masonry (Optional, default: grid)",
    "columns": "Number (Optional, 2-3, default: 3)",
    "style": "card | minimal | quote (Optional, default: card)",
    "background": "default | gradient | colored (Optional)",
    "testimonials": [
      {
        "name": "String",
        "role": "String",
        "company": "String (Optional)",
        "companyLogo": "UrlString (Optional)",
        "avatar": "UrlString (Optional)",
        "content": "String",
        "rating": "Number (Optional, 1-5)",
        "date": "String (Optional)",
        "project": "String (Optional)",
        "location": "String (Optional)",
        "social": {
          "platform": "linkedin | twitter (Optional)",
          "url": "UrlString (Optional)"
        },
        "featured": "Boolean (Optional)",
        "video": {
          "url": "UrlString (Optional)",
          "thumbnail": "UrlString (Optional)"
        }
      }
    ]
  }
}
```

### G. Component: Call to Action (CTA)

Trigger: `type: "cta"`

```json
{
  "type": "cta",
  "content": {
    "title": "String",
    "subtitle": "String (Optional)",
    "description": "String (Optional)",
    "layout": "centered | split | banner (Optional, default: centered)",
    "background": "default | gradient | image | video (Optional)",
    "backgroundImage": "UrlString (Optional)",
    "backgroundVideo": "UrlString (Optional)",
    "overlay": {
      "enabled": "Boolean (Optional)",
      "color": "HexColor (Optional)",
      "opacity": "Number 0-1 (Optional)"
    },
    "image": {
      "url": "UrlString (Optional)",
      "position": "left | right (Optional)"
    },
    "primaryCta": {
      "text": "String",
      "href": "String",
      "variant": "primary | secondary (Optional)",
      "icon": "IconName (Optional)",
      "size": "small | medium | large (Optional)"
    },
    "secondaryCta": {
      "text": "String (Optional)",
      "href": "String (Optional)",
      "variant": "outline | link (Optional)",
      "icon": "IconName (Optional)"
    },
    "features": [
      {
        "text": "String (Optional)",
        "icon": "IconName (Optional)"
      }
    ],
    "badges": [
      {
        "text": "String (Optional)",
        "icon": "IconName (Optional)"
      }
    ]
  }
}
```

### H. Component: Contact Form

Trigger: `type: "contact"`

```json
{
  "type": "contact",
  "content": {
    "title": "String",
    "subtitle": "String (Optional)",
    "description": "String (Optional)",
    "layout": "form-only | split | side-by-side (Optional, default: form-only)",
    "contactInfo": {
      "email": "String (Optional)",
      "phone": "String (Optional)",
      "address": "String (Optional)",
      "workingHours": "String (Optional)",
      "social": [
        {
          "platform": "String",
          "url": "UrlString",
          "icon": "IconName (Optional)"
        }
      ]
    },
    "map": {
      "enabled": "Boolean (Optional)",
      "embedUrl": "UrlString (Optional)",
      "latitude": "Number (Optional)",
      "longitude": "Number (Optional)"
    },
    "form": {
      "action": "UrlString",
      "method": "POST | GET (Optional, default: POST)",
      "successMessage": "String (Optional)",
      "errorMessage": "String (Optional)",
      "fields": [
        {
          "name": "String",
          "label": "String",
          "type": "text | email | tel | textarea | select | checkbox | radio",
          "placeholder": "String (Optional)",
          "required": "Boolean (Optional)",
          "options": ["String (Optional, for select/radio)"]
        }
      ],
      "submitButton": {
        "text": "String",
        "variant": "primary | secondary (Optional)",
        "icon": "IconName (Optional)"
      }
    }
  }
}
```

### I. Component: Pricing

Trigger: `type: "pricing"`

```json
{
  "type": "pricing",
  "content": {
    "title": "String",
    "subtitle": "String (Optional)",
    "description": "String (Optional)",
    "billingToggle": {
      "enabled": "Boolean (Optional)",
      "monthly": "String (Optional, e.g., 'Monthly')",
      "yearly": "String (Optional, e.g., 'Yearly')",
      "discount": "String (Optional, e.g., 'Save 20%')"
    },
    "columns": "Number (Optional, 2-4, default: 3)",
    "plans": [
      {
        "name": "String",
        "description": "String (Optional)",
        "featured": "Boolean (Optional)",
        "badge": {
          "text": "String (Optional)",
          "variant": "primary | success (Optional)"
        },
        "price": {
          "monthly": "String",
          "yearly": "String (Optional)",
          "currency": "String (Optional, e.g., '$', 'Rp')",
          "period": "String (Optional, e.g., '/month', '/bulan')"
        },
        "features": [
          {
            "text": "String",
            "included": "Boolean (Optional, default: true)",
            "icon": "IconName (Optional)",
            "tooltip": "String (Optional)"
          }
        ],
        "cta": {
          "text": "String",
          "href": "String",
          "variant": "primary | secondary | outline (Optional)"
        },
        "footnote": "String (Optional)"
      }
    ],
    "faq": {
      "enabled": "Boolean (Optional)",
      "title": "String (Optional)",
      "items": [
        {
          "question": "String (Optional)",
          "answer": "String (Optional)"
        }
      ]
    }
  }
}
```

### J. Component: FAQ (Frequently Asked Questions)

Trigger: `type: "faq"`

```json
{
  "type": "faq",
  "content": {
    "title": "String",
    "subtitle": "String (Optional)",
    "description": "String (Optional)",
    "layout": "accordion | grid | two-column (Optional, default: accordion)",
    "categories": [
      {
        "name": "String (Optional)",
        "icon": "IconName (Optional)",
        "items": [
          {
            "question": "String",
            "answer": "String",
            "tags": ["String (Optional)"]
          }
        ]
      }
    ],
    "cta": {
      "title": "String (Optional)",
      "description": "String (Optional)",
      "button": {
        "text": "String (Optional)",
        "href": "String (Optional)"
      }
    }
  }
}
```

### K. Component: Blog/News

Trigger: `type: "blog"`

```json
{
  "type": "blog",
  "content": {
    "title": "String",
    "subtitle": "String (Optional)",
    "description": "String (Optional)",
    "layout": "grid | list | masonry | featured (Optional, default: grid)",
    "columns": "Number (Optional, 2-3, default: 3)",
    "filter": {
      "enabled": "Boolean (Optional)",
      "categories": ["String (Optional)"]
    },
    "posts": [
      {
        "title": "String",
        "excerpt": "String (Optional)",
        "content": "String (Optional)",
        "image": "UrlString (Optional)",
        "category": "String (Optional)",
        "tags": ["String (Optional)"],
        "author": {
          "name": "String",
          "avatar": "UrlString (Optional)",
          "role": "String (Optional)"
        },
        "date": "String",
        "readTime": "String (Optional)",
        "link": "UrlString",
        "featured": "Boolean (Optional)",
        "stats": {
          "views": "Number (Optional)",
          "comments": "Number (Optional)",
          "likes": "Number (Optional)"
        }
      }
    ],
    "pagination": {
      "enabled": "Boolean (Optional)",
      "itemsPerPage": "Number (Optional)"
    },
    "cta": {
      "text": "String (Optional)",
      "href": "String (Optional)"
    }
  }
}
```

### L. Component: Gallery

Trigger: `type: "gallery"`

```json
{
  "type": "gallery",
  "content": {
    "title": "String (Optional)",
    "subtitle": "String (Optional)",
    "layout": "grid | masonry | carousel | lightbox (Optional, default: grid)",
    "columns": "Number (Optional, 2-4, default: 3)",
    "gap": "small | medium | large (Optional)",
    "filter": {
      "enabled": "Boolean (Optional)",
      "categories": ["String (Optional)"]
    },
    "items": [
      {
        "image": "UrlString",
        "thumbnail": "UrlString (Optional)",
        "title": "String (Optional)",
        "description": "String (Optional)",
        "category": "String (Optional)",
        "tags": ["String (Optional)"],
        "link": "UrlString (Optional)",
        "author": {
          "name": "String (Optional)",
          "avatar": "UrlString (Optional)"
        },
        "date": "String (Optional)",
        "dimensions": {
          "width": "Number (Optional)",
          "height": "Number (Optional)"
        }
      }
    ]
  }
}
```

### M. Component: Process/Timeline

Trigger: `type: "process"`

```json
{
  "type": "process",
  "content": {
    "title": "String",
    "subtitle": "String (Optional)",
    "description": "String (Optional)",
    "layout": "vertical | horizontal | grid (Optional, default: vertical)",
    "style": "minimal | detailed | cards (Optional, default: detailed)",
    "steps": [
      {
        "number": "Number (Optional)",
        "title": "String",
        "description": "String (Optional)",
        "icon": "IconName (Optional)",
        "image": "UrlString (Optional)",
        "duration": "String (Optional)",
        "features": [
          {
            "text": "String (Optional)",
            "icon": "IconName (Optional)"
          }
        ],
        "cta": {
          "text": "String (Optional)",
          "href": "String (Optional)"
        }
      }
    ]
  }
}
```

### N. Component: Video

Trigger: `type: "video"`

```json
{
  "type": "video",
  "content": {
    "title": "String (Optional)",
    "subtitle": "String (Optional)",
    "description": "String (Optional)",
    "video": {
      "url": "UrlString",
      "provider": "youtube | vimeo | custom (Optional)",
      "thumbnail": "UrlString (Optional)",
      "autoplay": "Boolean (Optional)",
      "controls": "Boolean (Optional, default: true)",
      "loop": "Boolean (Optional)"
    },
    "layout": "centered | full-width | theater (Optional, default: centered)",
    "aspectRatio": "16:9 | 4:3 | 1:1 (Optional, default: 16:9)",
    "caption": "String (Optional)",
    "transcript": {
      "enabled": "Boolean (Optional)",
      "content": "String (Optional)"
    }
  }
}
```

### O. Component: Partners/Logos

Trigger: `type: "partners"`

```json
{
  "type": "partners",
  "content": {
    "title": "String (Optional)",
    "subtitle": "String (Optional)",
    "layout": "grid | carousel | marquee (Optional, default: grid)",
    "columns": "Number (Optional, 3-6, default: 5)",
    "grayscale": "Boolean (Optional)",
    "partners": [
      {
        "name": "String",
        "logo": "UrlString",
        "link": "UrlString (Optional)",
        "description": "String (Optional)"
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

**Conditional Rendering Rules:**

- Field yang ditandai `(Optional)` tidak perlu dikirim jika tidak digunakan
- Template HARUS melakukan null check sebelum merender field optional
- Jangan kirim empty string `""` untuk field yang tidak digunakan, lebih baik tidak dikirim sama sekali
- Array kosong `[]` boleh dikirim untuk menandakan "tidak ada data"

**Response Optimization:**

```javascript
// ✅ GOOD - Field optional tidak dikirim
{
  "type": "hero",
  "content": {
    "title": "Welcome",
    "cta": {
      "text": "Get Started",
      "href": "/start"
    }
  }
}

// ❌ BAD - Field optional dikirim dengan nilai kosong
{
  "type": "hero",
  "content": {
    "title": "Welcome",
    "subtitle": "",
    "description": null,
    "backgroundImage": "",
    "cta": {
      "text": "Get Started",
      "href": "/start",
      "icon": ""
    }
  }
}
```

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
      case 'cta':
        return <CallToAction {...section.content} />;
      case 'contact':
        return <Contact {...section.content} />;
      case 'pricing':
        return <Pricing {...section.content} />;
      case 'faq':
        return <FAQ {...section.content} />;
      case 'blog':
        return <Blog {...section.content} />;
      case 'gallery':
        return <Gallery {...section.content} />;
      case 'process':
        return <Process {...section.content} />;
      case 'video':
        return <Video {...section.content} />;
      case 'partners':
        return <Partners {...section.content} />;
      // ...
    }
  });
}
```

**Theme Injection:** Gunakan value dari theme object di JSON untuk meng-override CSS Variables di `:root` saat runtime.

```javascript
// Example Theme Injection
const applyTheme = theme => {
  const root = document.documentElement;
  if (theme.primary) root.style.setProperty('--color-primary', theme.primary);
  if (theme.secondary)
    root.style.setProperty('--color-secondary', theme.secondary);
  if (theme.accent) root.style.setProperty('--color-accent', theme.accent);
  if (theme.background)
    root.style.setProperty('--color-background', theme.background);
  if (theme.surface) root.style.setProperty('--color-surface', theme.surface);
  if (theme.text) root.style.setProperty('--color-text', theme.text);
  if (theme.textSecondary)
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
  if (theme.border) root.style.setProperty('--color-border', theme.border);
  if (theme.borderRadius)
    root.style.setProperty('--border-radius', theme.borderRadius);
  if (theme.fontFamily)
    root.style.setProperty('--font-family', theme.fontFamily);
};
```

**Conditional Rendering Best Practices:**

```javascript
// ✅ GOOD - Check optional fields before rendering
const Hero = ({
  title,
  subtitle,
  description,
  backgroundImage,
  cta,
  secondaryCta,
}) => {
  return (
    <section
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      }}
    >
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {description && <p>{description}</p>}
      {cta && <Button {...cta} />}
      {secondaryCta && <Button {...secondaryCta} />}
    </section>
  );
};

// ✅ GOOD - Handle empty arrays
const Features = ({ title, features = [] }) => {
  return (
    <section>
      <h2>{title}</h2>
      {features.length > 0 && (
        <div className="features-grid">
          {features.map(feature => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      )}
    </section>
  );
};

// ✅ GOOD - Nested optional fields
const Navbar = ({ logo, links = [], cta, search, social = [] }) => {
  return (
    <nav>
      {logo?.image && <img src={logo.image} alt={logo.text || 'Logo'} />}
      {logo?.text && !logo?.image && <span>{logo.text}</span>}

      <ul>
        {links.map(link => (
          <li key={link.path}>
            {link.icon && <Icon name={link.icon} />}
            <a href={link.path}>{link.label}</a>
          </li>
        ))}
      </ul>

      {search?.enabled && <SearchBar placeholder={search.placeholder} />}
      {cta && <Button {...cta} />}
      {social.length > 0 && <SocialLinks links={social} />}
    </nav>
  );
};
```

**Component Props Type Safety (TypeScript Example):**

```typescript
interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  height?: 'full' | 'medium' | 'small';
  alignment?: 'left' | 'center' | 'right';
  backgroundImage?: string;
  cta: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
}
```

## 🧪 5. Sample Valid JSON Payloads

### Example 1: Minimal Landing Page (Corporate)

```json
{
  "site": {
    "title": "TechStart Solutions",
    "description": "Enterprise software solutions for modern businesses",
    "logo": "https://example.com/logo.png"
  },
  "theme": {
    "primary": "#2563eb",
    "secondary": "#7c3aed",
    "background": "#ffffff",
    "text": "#1f2937",
    "mode": "light"
  },
  "navbar": {
    "type": "sticky",
    "links": [
      { "label": "Home", "path": "/" },
      { "label": "Services", "path": "/services" },
      { "label": "About", "path": "/about" },
      { "label": "Contact", "path": "/contact" }
    ],
    "cta": {
      "text": "Get Started",
      "href": "/start",
      "variant": "primary"
    }
  },
  "footer": {
    "layout": "columns",
    "tagline": "Building the future, one solution at a time",
    "sections": [
      {
        "title": "Company",
        "links": [
          { "label": "About Us", "path": "/about" },
          { "label": "Careers", "path": "/careers" }
        ]
      },
      {
        "title": "Legal",
        "links": [
          { "label": "Privacy Policy", "path": "/privacy" },
          { "label": "Terms of Service", "path": "/terms" }
        ]
      }
    ],
    "social": [
      {
        "platform": "linkedin",
        "url": "https://linkedin.com/company/techstart"
      },
      { "platform": "twitter", "url": "https://twitter.com/techstart" }
    ],
    "bottom": {
      "copyright": "© 2024 TechStart Solutions. All rights reserved."
    }
  },
  "pages": [
    {
      "path": "/",
      "sections": [
        {
          "type": "hero",
          "content": {
            "title": "Transform Your Business with Technology",
            "subtitle": "Enterprise Solutions That Scale",
            "height": "full",
            "cta": {
              "text": "Schedule Demo",
              "href": "/demo",
              "variant": "primary"
            }
          }
        },
        {
          "type": "stats",
          "content": {
            "layout": "row",
            "stats": [
              { "label": "Clients Worldwide", "value": "500", "suffix": "+" },
              { "label": "Success Rate", "value": "98", "suffix": "%" },
              { "label": "Years Experience", "value": "15" }
            ]
          }
        },
        {
          "type": "cta",
          "content": {
            "title": "Ready to Get Started?",
            "description": "Join hundreds of companies already transforming with us",
            "primaryCta": {
              "text": "Contact Sales",
              "href": "/contact"
            }
          }
        }
      ]
    }
  ]
}
```

### Example 2: Rich Portfolio Site (Creative Agency)

```json
{
  "site": {
    "title": "Pixel Perfect Studio",
    "description": "Award-winning digital agency",
    "logo": "https://example.com/logo.svg",
    "favicon": "https://example.com/favicon.ico"
  },
  "theme": {
    "primary": "#f59e0b",
    "secondary": "#ec4899",
    "accent": "#8b5cf6",
    "background": "#0f172a",
    "surface": "#1e293b",
    "text": "#f1f5f9",
    "textSecondary": "#94a3b8",
    "mode": "dark",
    "borderRadius": "12px",
    "fontFamily": "Inter, sans-serif"
  },
  "navbar": {
    "type": "sticky",
    "transparent": true,
    "logo": {
      "image": "https://example.com/logo-white.svg",
      "text": "Pixel Perfect"
    },
    "links": [
      { "label": "Work", "path": "/work" },
      { "label": "Services", "path": "/services" },
      { "label": "About", "path": "/about" },
      { "label": "Blog", "path": "/blog" }
    ],
    "cta": {
      "text": "Start Project",
      "href": "/contact",
      "variant": "primary",
      "icon": "arrow-right"
    },
    "social": [
      { "platform": "instagram", "url": "https://instagram.com/pixelperfect" },
      { "platform": "dribbble", "url": "https://dribbble.com/pixelperfect" }
    ]
  },
  "footer": {
    "layout": "columns",
    "showLogo": true,
    "logo": {
      "image": "https://example.com/logo-white.svg"
    },
    "tagline": "Crafting digital experiences that inspire",
    "sections": [
      {
        "title": "Services",
        "links": [
          { "label": "Brand Identity", "path": "/services/branding" },
          { "label": "Web Design", "path": "/services/web-design" },
          { "label": "Mobile Apps", "path": "/services/mobile" },
          { "label": "Marketing", "path": "/services/marketing" }
        ]
      },
      {
        "title": "Company",
        "links": [
          { "label": "About Us", "path": "/about" },
          { "label": "Our Team", "path": "/team" },
          {
            "label": "Careers",
            "path": "/careers",
            "badge": { "text": "We're hiring!" }
          },
          { "label": "Contact", "path": "/contact" }
        ]
      },
      {
        "title": "Resources",
        "links": [
          { "label": "Blog", "path": "/blog" },
          { "label": "Case Studies", "path": "/case-studies" },
          { "label": "Design System", "path": "/design-system" }
        ]
      }
    ],
    "contact": {
      "email": "hello@pixelperfect.com",
      "phone": "+1 (555) 123-4567",
      "address": "123 Creative Street, Design City, DC 12345"
    },
    "newsletter": {
      "enabled": true,
      "title": "Stay in the loop",
      "description": "Get design tips and project updates",
      "placeholder": "Enter your email",
      "buttonText": "Subscribe"
    },
    "social": [
      { "platform": "instagram", "url": "https://instagram.com/pixelperfect" },
      { "platform": "dribbble", "url": "https://dribbble.com/pixelperfect" },
      { "platform": "behance", "url": "https://behance.net/pixelperfect" },
      { "platform": "twitter", "url": "https://twitter.com/pixelperfect" }
    ],
    "bottom": {
      "copyright": "© 2024 Pixel Perfect Studio. All rights reserved.",
      "links": [
        { "label": "Privacy Policy", "path": "/privacy" },
        { "label": "Terms of Service", "path": "/terms" },
        { "label": "Cookie Policy", "path": "/cookies" }
      ]
    },
    "background": "gradient"
  },
  "pages": [
    {
      "path": "/",
      "title": "Pixel Perfect Studio - Award-winning Digital Agency",
      "description": "We create stunning digital experiences",
      "sections": [
        {
          "type": "hero",
          "content": {
            "title": "We Create Digital Experiences That Matter",
            "subtitle": "Award-winning creative agency",
            "description": "Transforming brands through design, strategy, and innovation",
            "height": "full",
            "alignment": "left",
            "backgroundVideo": "https://example.com/hero-bg.mp4",
            "overlay": {
              "enabled": true,
              "color": "#000000",
              "opacity": 0.5
            },
            "badges": [
              { "text": "Award Winning", "icon": "trophy" },
              { "text": "50+ Projects", "icon": "briefcase" }
            ],
            "cta": {
              "text": "View Our Work",
              "href": "/work",
              "variant": "primary",
              "icon": "arrow-right",
              "size": "large"
            },
            "secondaryCta": {
              "text": "Watch Showreel",
              "href": "/showreel",
              "variant": "outline",
              "icon": "play"
            }
          }
        },
        {
          "type": "partners",
          "content": {
            "title": "Trusted by Industry Leaders",
            "layout": "marquee",
            "grayscale": true,
            "partners": [
              { "name": "Google", "logo": "https://example.com/google.svg" },
              {
                "name": "Microsoft",
                "logo": "https://example.com/microsoft.svg"
              },
              { "name": "Apple", "logo": "https://example.com/apple.svg" }
            ]
          }
        },
        {
          "type": "grid",
          "content": {
            "title": "Featured Projects",
            "subtitle": "Our Latest Work",
            "columns": 3,
            "style": "overlay",
            "filter": {
              "enabled": true,
              "categories": ["All", "Branding", "Web", "Mobile"]
            },
            "items": [
              {
                "title": "E-commerce Redesign",
                "description": "Complete brand and platform transformation",
                "category": "Web",
                "image": "https://example.com/project1.jpg",
                "badges": [{ "text": "Featured", "variant": "primary" }],
                "link": "/work/ecommerce-redesign"
              }
            ]
          }
        },
        {
          "type": "testimonials",
          "content": {
            "title": "What Clients Say",
            "layout": "carousel",
            "style": "quote",
            "testimonials": [
              {
                "name": "Sarah Johnson",
                "role": "CEO",
                "company": "TechCorp",
                "companyLogo": "https://example.com/techcorp.svg",
                "avatar": "https://example.com/sarah.jpg",
                "content": "Pixel Perfect transformed our brand completely. The results exceeded all expectations.",
                "rating": 5,
                "featured": true
              }
            ]
          }
        },
        {
          "type": "cta",
          "content": {
            "title": "Let's Create Something Amazing",
            "description": "Ready to transform your brand?",
            "layout": "centered",
            "background": "gradient",
            "primaryCta": {
              "text": "Start Your Project",
              "href": "/contact",
              "icon": "arrow-right"
            },
            "secondaryCta": {
              "text": "View Pricing",
              "href": "/pricing",
              "variant": "outline"
            }
          }
        }
      ]
    }
  ]
}
```

### Example 3: Minimal SaaS Product Page

```json
{
  "site": {
    "title": "CloudFlow - Project Management",
    "description": "Simple, powerful project management"
  },
  "theme": {
    "primary": "#3b82f6",
    "background": "#ffffff",
    "text": "#111827",
    "mode": "light"
  },
  "navbar": {
    "links": [
      { "label": "Features", "path": "#features" },
      { "label": "Pricing", "path": "#pricing" }
    ],
    "cta": {
      "text": "Try Free",
      "href": "/signup"
    }
  },
  "footer": {
    "layout": "minimal",
    "bottom": {
      "copyright": "© 2024 CloudFlow"
    }
  },
  "pages": [
    {
      "path": "/",
      "sections": [
        {
          "type": "hero",
          "content": {
            "title": "Project Management Made Simple",
            "description": "Everything you need to manage projects in one place",
            "cta": {
              "text": "Start Free Trial",
              "href": "/signup"
            }
          }
        },
        {
          "type": "features",
          "content": {
            "title": "Everything You Need",
            "layout": "grid",
            "columns": 3,
            "features": [
              {
                "title": "Task Management",
                "description": "Organize and prioritize tasks",
                "icon": "check-square"
              },
              {
                "title": "Team Collaboration",
                "description": "Work together seamlessly",
                "icon": "users"
              },
              {
                "title": "Real-time Updates",
                "description": "Stay in sync with your team",
                "icon": "zap"
              }
            ]
          }
        },
        {
          "type": "pricing",
          "content": {
            "title": "Simple Pricing",
            "plans": [
              {
                "name": "Free",
                "price": {
                  "monthly": "0",
                  "currency": "$"
                },
                "features": [
                  { "text": "Up to 5 projects" },
                  { "text": "Basic features" }
                ],
                "cta": {
                  "text": "Get Started",
                  "href": "/signup"
                }
              },
              {
                "name": "Pro",
                "featured": true,
                "price": {
                  "monthly": "12",
                  "currency": "$"
                },
                "features": [
                  { "text": "Unlimited projects" },
                  { "text": "Advanced features" },
                  { "text": "Priority support" }
                ],
                "cta": {
                  "text": "Start Trial",
                  "href": "/signup"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

---

## 🔧 6. Extensibility & Customization

### Adding New Component Types

Saat menambahkan komponen baru, ikuti pattern berikut:

1. **Define Schema** - Tentukan struktur data dengan clear typing
2. **Document Optional Fields** - Tandai semua field optional dengan `(Optional)`
3. **Provide Defaults** - Dokumentasikan nilai default untuk field optional
4. **Example Usage** - Berikan minimal 1 contoh implementasi

```json
// Template untuk komponen baru
{
  "type": "new-component-name",
  "content": {
    "title": "String (Required)",
    "subtitle": "String (Optional)",
    "layout": "variant1 | variant2 (Optional, default: variant1)"
    // ... field lainnya
  }
}
```

### Component Variants

Setiap komponen bisa memiliki variant untuk mendukung berbagai use case:

**Layout Variants:**

- `grid` - Traditional grid layout
- `list` - Vertical list layout
- `carousel` - Horizontal scrolling
- `masonry` - Pinterest-style layout

**Style Variants:**

- `card` - Bordered card with shadow
- `minimal` - Clean without borders
- `overlay` - Image with text overlay
- `gradient` - Gradient background

**Size Variants:**

- `small` - Compact spacing
- `medium` - Standard spacing (default)
- `large` - Generous spacing

### Dynamic Field Rendering Logic

Template harus mengikuti logic berikut untuk conditional rendering:

```javascript
// Priority-based rendering
if (field !== undefined && field !== null && field !== '') {
  render(field);
}

// Array checking
if (Array.isArray(items) && items.length > 0) {
  render(items);
}

// Object checking
if (object && Object.keys(object).length > 0) {
  render(object);
}

// Nested optional with fallback
const displayValue = config?.primary || config?.fallback || 'default';
```

### API Response Size Optimization

**Best Practices:**

1. Omit optional fields yang tidak digunakan
2. Gunakan short property names untuk data besar
3. Compress images dan assets
4. Lazy load untuk data besar (pagination, infinite scroll)

**Example - Optimized vs Unoptimized:**

```javascript
// ❌ UNOPTIMIZED (1.2KB)
{
  "type": "features",
  "content": {
    "title": "Our Services",
    "subtitle": "",
    "description": null,
    "layout": "grid",
    "columns": 3,
    "alignment": "center",
    "background": "default",
    "features": []
  }
}

// ✅ OPTIMIZED (200 bytes)
{
  "type": "features",
  "content": {
    "title": "Our Services",
    "features": []
  }
}
```

---

## 📋 7. Validation & Error Handling

### API Response Validation

API harus mengembalikan error response yang jelas jika ada masalah:

```json
{
  "error": true,
  "message": "Invalid component type",
  "details": {
    "component": "hero",
    "field": "content.cta.href",
    "reason": "Required field missing"
  }
}
```

### Template Error Boundaries

Template harus handle error gracefully:

```javascript
// Error boundary untuk component
const SafeComponent = ({ type, content }) => {
  try {
    return renderComponent(type, content);
  } catch (error) {
    console.error(`Failed to render ${type}:`, error);
    return <ErrorFallback componentType={type} />;
  }
};

// Graceful degradation
const Hero = ({ title, backgroundImage }) => {
  return (
    <section>
      {title ? <h1>{title}</h1> : <h1>Welcome</h1>}
      {backgroundImage ? (
        <img
          src={backgroundImage}
          onError={e => (e.target.style.display = 'none')}
        />
      ) : null}
    </section>
  );
};
```

### Validation Checklist

**API Side:**

- ✅ All required fields present
- ✅ Type values match exactly (case-sensitive)
- ✅ URLs are valid and accessible
- ✅ Enum values match allowed options
- ✅ Arrays contain valid objects
- ✅ No circular references

**Template Side:**

- ✅ Null/undefined checks on all optional fields
- ✅ Array.length checks before mapping
- ✅ Default values for missing configs
- ✅ Image loading error handlers
- ✅ Type validation for dynamic data
- ✅ Accessibility attributes (alt, aria-labels)

---

## 🎨 8. Design System Integration

### Color System

All colors should reference theme variables:

```javascript
// Component should use theme colors
const Button = ({ variant = 'primary' }) => {
  const colorMap = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)',
  };

  return <button style={{ backgroundColor: colorMap[variant] }}>Click</button>;
};
```

### Responsive Design

Components must be responsive by default:

```json
{
  "type": "grid",
  "content": {
    "columns": 4, // Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col (auto-responsive)
    "gap": "medium"
  }
}
```

### Accessibility (a11y)

Semua komponen harus accessible:

```javascript
// ✅ GOOD - Accessible component
<button
  aria-label={ariaLabel || text}
  role="button"
  tabIndex={0}
>
  {icon && <Icon name={icon} aria-hidden="true" />}
  {text}
</button>

// Image with proper alt
<img
  src={image}
  alt={alt || title || 'Decorative image'}
  loading="lazy"
/>
```

---

## 🚀 9. Performance Considerations

### Image Optimization

```json
{
  "image": "https://example.com/image.jpg",
  "thumbnail": "https://example.com/image-thumb.jpg", // Use thumbnail for previews
  "dimensions": {
    "width": 1920,
    "height": 1080
  }
}
```

### Lazy Loading

```javascript
// Components should support lazy loading
const Gallery = ({ items }) => {
  return items.map(item => (
    <img
      src={item.thumbnail || item.image}
      data-src={item.image}
      loading="lazy"
      alt={item.title}
    />
  ));
};
```

### Code Splitting

```javascript
// Dynamic imports for large components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

const PageBuilder = ({ sections }) => {
  return sections.map(section => {
    if (section.type === 'heavy-component') {
      return (
        <Suspense fallback={<Spinner />}>
          <HeavyComponent {...section.content} />
        </Suspense>
      );
    }
    // ... other components
  });
};
```

---

## 📝 10. Summary & Quick Reference

### Component Type Quick Reference

| Type           | Use Case             | Required Fields           | Common Optionals                              |
| -------------- | -------------------- | ------------------------- | --------------------------------------------- |
| `hero`         | Landing header       | `title`, `cta`            | `subtitle`, `backgroundImage`, `secondaryCta` |
| `features`     | Service/feature list | `title`, `features[]`     | `layout`, `columns`, `description`            |
| `grid`         | Portfolio/projects   | `title`, `items[]`        | `columns`, `filter`, `style`                  |
| `stats`        | Metrics/numbers      | `stats[]`                 | `title`, `layout`, `background`               |
| `team`         | Team members         | `title`, `members[]`      | `layout`, `columns`, `style`                  |
| `testimonials` | Client reviews       | `title`, `testimonials[]` | `layout`, `rating`, `video`                   |
| `cta`          | Call to action       | `title`, `primaryCta`     | `description`, `secondaryCta`, `background`   |
| `contact`      | Contact form         | `title`, `form`           | `contactInfo`, `map`                          |
| `pricing`      | Pricing plans        | `title`, `plans[]`        | `billingToggle`, `faq`                        |
| `faq`          | Q&A section          | `title`, `categories[]`   | `layout`, `cta`                               |
| `blog`         | Blog posts           | `title`, `posts[]`        | `layout`, `filter`, `pagination`              |
| `gallery`      | Image gallery        | `items[]`                 | `title`, `layout`, `filter`                   |
| `process`      | Step-by-step         | `title`, `steps[]`        | `layout`, `style`                             |
| `video`        | Video embed          | `video.url`               | `title`, `layout`, `transcript`               |
| `partners`     | Logo showcase        | `partners[]`              | `title`, `layout`, `grayscale`                |

### Field Naming Conventions

- Use `camelCase` for all property names
- Boolean fields: `enabled`, `visible`, `featured`, `required`
- URLs: end with `Url` or standalone as `url`, `href`, `link`
- Collections: use plural names (`items`, `features`, `members`)
- Single items: use singular (`item`, `feature`, `member`)

### Response Size Guidelines

| Page Type      | Target Size | Max Size |
| -------------- | ----------- | -------- |
| Simple landing | < 50KB      | 100KB    |
| Rich portfolio | < 150KB     | 300KB    |
| Full website   | < 500KB     | 1MB      |

_Note: Sizes exclude external assets (images, videos)_

---

## 🔗 Related Resources

- **Icon Library:** Lucide React (https://lucide.dev)
- **Color Palette Tools:** Coolors, Adobe Color
- **Image Optimization:** TinyPNG, ImageOptim
- **Validation:** JSON Schema validator
- **Testing:** Component unit tests, E2E tests

---

**Document Version:** 2.0
**Last Updated:** December 2024
**Maintained By:** Development Team
