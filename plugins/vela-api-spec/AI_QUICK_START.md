# ⚡ AI Generator - 5-Minute Quick Start

## 🎯 Setup (2 minutes)

### 1. Get Free API Key

1. Visit https://openrouter.ai/keys
2. Sign up (Google/GitHub)
3. Create Key → Copy

### 2. Add to Environment

Create/edit `.env`:

```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

### 3. Restart App

```bash
yarn start
```

## 🚀 First Generation (1 minute)

1. Open http://localhost:3000/vela-api-spec
2. Click **"🤖 AI Generator"** tab
3. Try this prompt:
   ```
   Create a landing page for a fitness app with hero, features, and pricing
   ```
4. Click **"✨ Generate with AI"**
5. Wait ~15 seconds → See JSON result!

---

## 💡 Example Prompts

### E-commerce

```
Create a modern e-commerce site for sustainable fashion.
Include hero with product showcase, featured products grid,
about our mission, testimonials, and newsletter signup.
```

### SaaS Product

```
Create a SaaS landing page for project management tool.
Include hero with demo CTA, key features, pricing (3 tiers),
customer testimonials, and contact form.
```

### Portfolio

```
Create a portfolio for a freelance photographer.
Include hero with stunning image, photo gallery, about me,
services, testimonials, and contact form.
```

### Restaurant

```
Create a restaurant website with hero showing signature dish,
menu highlights, chef's story, customer reviews,
location map, and reservation form.
```

---

## 🎨 Generation Modes

| Mode                 | When to Use              | Time |
| -------------------- | ------------------------ | ---- |
| **Natural Language** | Quick ideas, exploration | 15s  |
| **Complete Site**    | Full production site     | 20s  |
| **Single Page**      | Add new pages            | 10s  |
| **Single Component** | Specific sections        | 5s   |

---

## ⚡ Pro Tips

### ✅ Good Prompts

- "Create a SaaS landing page for AI chatbot with hero, 3 features, pricing, testimonials"
- "Modern e-commerce for eco-fashion targeting millennials"
- "Portfolio for photographer with gallery, about, services, contact"

### ❌ Bad Prompts

- "make a website"
- "create something nice"
- "I need a site"

### 🔥 Best Practices

1. **Be specific** - Mention sections you need
2. **Add context** - Industry, audience, style
3. **Include numbers** - "3 features", "4 pricing tiers"
4. **Mention style** - "modern", "minimalist", "vibrant"

---

## 🐛 Common Issues

**No API key error?**
→ Check `.env` has `OPENROUTER_API_KEY=...`

**Slow response?**
→ Simplify prompt, try again

**Invalid JSON?**
→ Click "Generate" again

**Backend not responding?**
→ `yarn start` to restart

---

## ⏱️ Generation Times

- Single Component: **5-10s**
- Single Page: **10-15s**
- Complete Site: **15-25s**
- Natural Prompt: **15-30s**

---

## 📚 More Help

- Full AI Guide: [AI_FEATURES.md](./AI_FEATURES.md)
- Backend API: [README.md](./README.md)
- Frontend UI: [plugins/vela-api-spec-fe/README.md](../vela-api-spec-fe/README.md)

**Happy Generating! 🎉**
