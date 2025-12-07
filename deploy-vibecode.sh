#!/bin/bash

# Deployment Script untuk Vibecode Namespace
# Domain: https://vibecode.hackathon.sev-2.com

set -e

echo "🚀 Vela Backstage Deployment to Vibecode"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="vibecode"
KUBECONFIG_FILE="credential-vibecode/kubeconfig.yaml"
DOCKER_IMAGE="saaandd/backstage:1.0.0"

# Check if kubeconfig exists
if [ ! -f "$KUBECONFIG_FILE" ]; then
    echo -e "${RED}❌ Kubeconfig not found: $KUBECONFIG_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Step 1: Build Application${NC}"
echo "Installing dependencies..."
yarn install --immutable

echo "Compiling TypeScript..."
yarn tsc

echo "Building backend..."
yarn build:backend

echo -e "${GREEN}✅ Build complete${NC}"
echo ""

echo -e "${YELLOW}🐳 Step 2: Build & Push Docker Image${NC}"
echo "Building Docker image: $DOCKER_IMAGE"
sudo docker build . --network=host -f packages/backend/Dockerfile -t $DOCKER_IMAGE

echo "Pushing to Docker Hub..."
sudo docker push $DOCKER_IMAGE

echo -e "${GREEN}✅ Docker image pushed${NC}"
echo ""

echo -e "${YELLOW}☸️  Step 3: Deploy to Kubernetes${NC}"
echo "Using namespace: $NAMESPACE"

# Apply secrets
echo "Applying secrets..."
sudo kubectl --kubeconfig=$KUBECONFIG_FILE apply -f kubernetes/secrets.yaml

# Apply deployment
echo "Applying deployment..."
sudo kubectl --kubeconfig=$KUBECONFIG_FILE apply -f kubernetes/k8s-backstage.yaml

# Apply ingress
echo "Applying ingress..."
sudo kubectl --kubeconfig=$KUBECONFIG_FILE apply -f kubernetes/ingress.yaml

echo -e "${GREEN}✅ Kubernetes resources applied${NC}"
echo ""

echo -e "${YELLOW}🔄 Step 4: Restart Deployment${NC}"
sudo kubectl --kubeconfig=$KUBECONFIG_FILE rollout restart deployment/backstage-deployment -n $NAMESPACE

echo -e "${GREEN}✅ Deployment restarted${NC}"
echo ""

echo -e "${YELLOW}📊 Step 5: Verification${NC}"
echo "Checking pods..."
sudo kubectl --kubeconfig=$KUBECONFIG_FILE get pods -n $NAMESPACE

echo ""
echo "Checking ingress..."
sudo kubectl --kubeconfig=$KUBECONFIG_FILE get ingress -n $NAMESPACE

echo ""
echo -e "${GREEN}=========================================="
echo "🎉 Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo "Your application should be available at:"
echo -e "${GREEN}https://vibecode.hackathon.sev-2.com${NC}"
echo ""
echo "To check logs:"
echo "  kubectl --kubeconfig=$KUBECONFIG_FILE logs -f deployment/backstage-deployment -n $NAMESPACE"
echo ""
echo "To check status:"
echo "  kubectl --kubeconfig=$KUBECONFIG_FILE get pods -n $NAMESPACE"
