#!/bin/bash

# Test script untuk save config ke GitHub
# Pastikan backend sudah running dan konfigurasi GitHub sudah benar

BASE_URL="http://localhost:7007/api/vela-api-spec"

echo "🧪 Testing GitHub Integration - Save Config"
echo "============================================"
echo ""

# Test 1: Check GitHub Info
echo "1️⃣ Checking GitHub configuration..."
response=$(curl -s "${BASE_URL}/github/info")
echo "$response"

if echo "$response" | grep -q "error"; then
  echo "❌ GitHub not configured! Please:"
  echo "   1. Set VELA_GITHUB_TOKEN, VELA_GITHUB_OWNER, VELA_GITHUB_REPO in .env"
  echo "   2. Restart backend"
  exit 1
fi

echo "✅ GitHub configured!"
echo ""

# Test 2: Save example config
echo "2️⃣ Saving example config to GitHub..."

# Create a simple test config
cat > /tmp/test-config.json << 'EOF'
{
  "site": {
    "title": "Test Site",
    "description": "Test configuration from vela-api-spec"
  },
  "theme": {
    "primary": "#3b82f6",
    "background": "#ffffff",
    "text": "#1f2937",
    "mode": "light"
  },
  "pages": [
    {
      "path": "/",
      "title": "Home",
      "sections": []
    }
  ]
}
EOF

# Save to GitHub
response=$(curl -s -X POST "${BASE_URL}/github/save-config" \
  -H "Content-Type: application/json" \
  -d "{
    \"config\": $(cat /tmp/test-config.json),
    \"filename\": \"test/test-config-$(date +%s).json\",
    \"message\": \"Test: Add config from vela-api-spec\"
  }")

echo "$response"

if echo "$response" | grep -q "error"; then
  echo "❌ Failed to save!"
  exit 1
fi

echo ""
echo "✅ Config saved to GitHub!"
echo ""

# Extract URL if available
url=$(echo "$response" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
if [ ! -z "$url" ]; then
  echo "🔗 View on GitHub: $url"
fi

echo ""
echo "============================================"
echo "🎉 Test Complete!"
