# Vela API Spec Plugin - Quick Start

## 🚀 What is this?

Plugin Backstage untuk menghasilkan API specification berdasarkan **CONTEXT.md** yang mendefinisikan Dynamic Site Generator Protocol dengan arsitektur Server-Driven UI (SDUI).

## 📦 Installation

1. **Install dependencies:**

```bash
# From root directory
yarn install
```

2. **Start backend:**

```bash
cd packages/backend
yarn start
```

3. **Test plugin:**

```bash
curl http://localhost:7007/api/vela-api-spec/health
```

## 🎯 Features

- ✅ **15 Component Types** (Hero, Features, Grid, Stats, Team, Testimonials, CTA, Contact, Pricing, FAQ, Blog, Gallery, Process, Video, Partners)
- ✅ **JSON Schema Validation** untuk setiap component
- ✅ **Site Configuration Templates** (minimal, portfolio)
- ✅ **API Endpoints** untuk generate & validate
- ✅ **Example Payloads** siap pakai
- ✅ **TypeScript Support** dengan full typing

## 🔥 Quick Examples

### Get Hero Component Schema

```bash
curl http://localhost:7007/api/vela-api-spec/schemas/components/hero
```

### Generate Simple Site Config

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/generate/site-config \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "site": {"title": "My Site", "description": "Awesome site"},
      "theme": {
        "primary": "#3b82f6",
        "background": "#ffffff",
        "text": "#1f2937",
        "mode": "light"
      }
    }
  }'
```

### Get Example Site (Minimal Landing Page)

```bash
curl http://localhost:7007/api/vela-api-spec/examples/minimal
```

### Validate Configuration

```bash
curl -X POST http://localhost:7007/api/vela-api-spec/validate/site-config \
  -H "Content-Type: application/json" \
  -d @examples/minimal-landing.json
```

## 📚 Documentation

- **API Usage Guide:** [API_USAGE.md](./API_USAGE.md)
- **Plugin README:** [README.md](./README.md)
- **Examples:** [examples/](./examples/)
- **Main Context:** [CONTEXT.md](../../CONTEXT.md)

## 🧩 Component Types

| Type           | Description             | Use Case                  |
| -------------- | ----------------------- | ------------------------- |
| `hero`         | Hero section with CTA   | Landing pages, home pages |
| `features`     | Feature grid with icons | Service lists, benefits   |
| `grid`         | Project/portfolio grid  | Portfolio, case studies   |
| `stats`        | Statistics display      | Metrics, achievements     |
| `team`         | Team member profiles    | About page, team page     |
| `testimonials` | Client reviews          | Social proof              |
| `cta`          | Call-to-action          | Lead generation           |
| `contact`      | Contact form            | Contact page              |
| `pricing`      | Pricing table           | Product pricing           |
| `faq`          | FAQ section             | Help, support             |
| `blog`         | Blog post list          | Blog, news                |
| `gallery`      | Image gallery           | Portfolio, photos         |
| `process`      | Step-by-step            | How it works              |
| `video`        | Video embed             | Demos, tutorials          |
| `partners`     | Partner logos           | Trust, credibility        |

## 🎨 Example Site Structures

### Minimal Landing Page

```
Hero → Partners → Features → Stats → Pricing → Testimonials → CTA
```

### Portfolio Site

```
Hero → Partners → Grid (Projects) → Stats → Team → Testimonials → Process → CTA
```

### SaaS Product

```
Hero → Features → Video → Pricing → FAQ → Testimonials → CTA
```

## 📂 Project Structure

```
vela-api-spec/
├── src/
│   ├── index.ts              # Plugin entry
│   ├── plugin.ts             # Plugin definition
│   ├── router.ts             # API routes
│   ├── types.ts              # TypeScript types
│   ├── service/
│   │   ├── ApiSpecGenerator.ts    # Main generator
│   │   └── ComponentSchemas.ts    # Schema definitions
│   └── setupTests.ts
├── examples/
│   ├── minimal-landing.json       # Minimal site example
│   ├── portfolio-site.json        # Portfolio example
│   └── README.md
├── package.json
├── README.md
├── API_USAGE.md              # Complete API guide
└── QUICK_START.md            # This file
```

## 🔧 Development

```bash
# Build plugin
yarn build

# Run tests
yarn test

# Lint
yarn lint

# Clean
yarn clean
```

## 🌐 API Endpoints Summary

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| GET    | `/health`                   | Health check         |
| GET    | `/templates/site-config`    | Get site template    |
| GET    | `/schemas/components`       | Get all schemas      |
| GET    | `/schemas/components/:type` | Get component schema |
| POST   | `/generate/site-config`     | Generate site config |
| POST   | `/generate/page`            | Generate page        |
| POST   | `/generate/component/:type` | Generate component   |
| POST   | `/validate/site-config`     | Validate config      |
| GET    | `/examples/:type`           | Get example          |

## 💡 Tips

1. **Start with examples:** Use `/examples/minimal` or `/examples/portfolio` as starting point
2. **Check schemas first:** Use `/schemas/components/:type` to understand structure
3. **Validate often:** Always validate before deployment
4. **Optional fields:** Only include fields you actually use
5. **Consistent naming:** Use camelCase and standard icon names

## 🚨 Common Issues

### Plugin not found

```bash
# Make sure you ran yarn install
yarn install

# Check if plugin is in backend/package.json
grep "vela-api-spec" packages/backend/package.json
```

### Validation errors

```bash
# Check required fields in schema
curl http://localhost:7007/api/vela-api-spec/schemas/components/hero

# Look at example
curl http://localhost:7007/api/vela-api-spec/examples/minimal
```

## 🤝 Contributing

1. Create component in `ComponentSchemas.ts`
2. Add example in `examples/`
3. Update documentation
4. Test with validation endpoint

## 📄 License

Apache-2.0

---

**Need help?** Check [API_USAGE.md](./API_USAGE.md) for detailed examples and [CONTEXT.md](../../CONTEXT.md) for full specification.
