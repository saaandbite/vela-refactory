#!/bin/bash

# Test script untuk GitHub Integration
# Pastikan backend sudah running di http://localhost:7007

BASE_URL="http://localhost:7007/api/vela-api-spec"

echo "🧪 Testing Vela API Spec - GitHub Integration"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Get GitHub Info
echo -e "${YELLOW}Test 1: Get GitHub Repository Info${NC}"
response=$(curl -s "${BASE_URL}/github/info")
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Success${NC}"
  echo "$response" | jq '.'
else
  echo -e "${RED}✗ Failed${NC}"
fi
echo ""

# Test 2: List Files
echo -e "${YELLOW}Test 2: List Files in Repository${NC}"
response=$(curl -s "${BASE_URL}/github/files")
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Success${NC}"
  echo "$response" | jq '.'
else
  echo -e "${RED}✗ Failed${NC}"
fi
echo ""

# Test 3: Generate and Save Config
echo -e "${YELLOW}Test 3: Generate Site Config with AI${NC}"
config=$(curl -s -X POST "${BASE_URL}/ai/generate/site-config" \
  -H "Content-Type: application/json" \
  -d '{
    "siteName": "Test Site",
    "siteDescription": "A test site for GitHub integration",
    "industry": "Technology",
    "targetAudience": "Developers"
  }')

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Config Generated${NC}"
  
  # Extract the config data
  config_data=$(echo "$config" | jq '.data')
  
  # Test 4: Save to GitHub
  echo -e "${YELLOW}Test 4: Save Config to GitHub${NC}"
  save_response=$(curl -s -X POST "${BASE_URL}/github/save-config" \
    -H "Content-Type: application/json" \
    -d "{
      \"config\": $config_data,
      \"filename\": \"test-configs/test-site-$(date +%s).json\",
      \"message\": \"Test: Add generated site config\"
    }")
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Saved to GitHub${NC}"
    echo "$save_response" | jq '.'
    
    # Extract file path and SHA for cleanup
    file_path=$(echo "$save_response" | jq -r '.path')
    file_sha=$(echo "$save_response" | jq -r '.sha')
    
    # Test 5: Read back the file
    echo ""
    echo -e "${YELLOW}Test 5: Read File from GitHub${NC}"
    read_response=$(curl -s "${BASE_URL}/github/file?path=${file_path}")
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✓ File Read Successfully${NC}"
      echo "$read_response" | jq '.path, .sha'
    else
      echo -e "${RED}✗ Failed to read file${NC}"
    fi
    
    # Test 6: Update the file
    echo ""
    echo -e "${YELLOW}Test 6: Update File in GitHub${NC}"
    updated_config=$(echo "$config_data" | jq '.site.title = "Updated Test Site"')
    update_response=$(curl -s -X POST "${BASE_URL}/github/save" \
      -H "Content-Type: application/json" \
      -d "{
        \"path\": \"${file_path}\",
        \"content\": $(echo "$updated_config" | jq -c '.'),
        \"message\": \"Test: Update site config\",
        \"sha\": \"${file_sha}\"
      }")
    
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✓ File Updated${NC}"
      new_sha=$(echo "$update_response" | jq -r '.sha')
      echo "New SHA: $new_sha"
    else
      echo -e "${RED}✗ Failed to update file${NC}"
    fi
    
    # Test 7: Delete the test file (cleanup)
    echo ""
    echo -e "${YELLOW}Test 7: Delete Test File (Cleanup)${NC}"
    read -p "Do you want to delete the test file? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      delete_response=$(curl -s -X DELETE "${BASE_URL}/github/file" \
        -H "Content-Type: application/json" \
        -d "{
          \"path\": \"${file_path}\",
          \"message\": \"Test: Remove test file\",
          \"sha\": \"${new_sha}\"
        }")
      
      if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ File Deleted${NC}"
        echo "$delete_response" | jq '.'
      else
        echo -e "${RED}✗ Failed to delete file${NC}"
      fi
    else
      echo "Skipped deletion. File remains at: ${file_path}"
    fi
  else
    echo -e "${RED}✗ Failed to save to GitHub${NC}"
  fi
else
  echo -e "${RED}✗ Failed to generate config${NC}"
fi

echo ""
echo "=============================================="
echo "🎉 GitHub Integration Tests Complete!"
