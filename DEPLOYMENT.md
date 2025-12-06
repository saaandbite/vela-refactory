# Backstage Deployment Guide

Panduan untuk build dan deploy Backstage ke Kubernetes.

## Prerequisites

- Node.js 20 atau 22
- Yarn (versi 4.x)
- Docker
- Kubernetes cluster (Minikube, Kind, atau remote)
- kubectl

## 1. Build Docker Image

### Menggunakan Script (Recommended)

```bash
./build-image.sh
```

### Manual Build

```bash
# Install dependencies
yarn install --immutable

# TypeScript compilation
yarn tsc

# Build backend bundle
yarn build:backend

# Build Docker image
sudo docker build . -f packages/backend/Dockerfile -t backstage:latest
```

### Untuk Minikube

```bash
eval $(minikube docker-env)
./build-image.sh
```

### Untuk Kind

```bash
sudo kind create cluster --name backstage
./build-image.sh
sudo kind load docker-image backstage:latest --name backstage
```

## 2. Deploy ke Kubernetes

### Step 2.1: Create Namespace

```bash
sudo kubectl apply -f kubernetes/namespace.yaml
```

### Step 2.2: Configure Secrets

Edit `kubernetes/secrets.yaml` dan ganti placeholder dengan nilai sebenarnya:

- `POSTGRES_PASSWORD`: Password database
- `GITHUB_TOKEN`: GitHub Personal Access Token

> ⚠️ **Warning**: Jangan commit file ini dengan secrets yang sebenarnya!

```bash
sudo kubectl apply -f kubernetes/secrets.yaml
```

### Step 2.3: Deploy PostgreSQL

```bash
sudo kubectl apply -f kubernetes/postgres.yaml
```

> ℹ️ **Note**: PostgreSQL ini hanya untuk development. Untuk production, gunakan managed database (Amazon RDS, Cloud SQL, dll).

### Step 2.4: Deploy Backstage

```bash
sudo kubectl apply -f kubernetes/deployment.yaml
sudo kubectl apply -f kubernetes/service.yaml
```

### Step 2.5: Setup Ingress (Optional)

```bash
sudo kubectl apply -f kubernetes/ingress.yaml

sudo kubectl get ingress -n backstage
```

Tambahkan ke `/etc/hosts`:
```
<INGRESS_IP> backstage.local
```

## 3. Verification

```bash
# Check pods
sudo kubectl get pods -n backstage

# Check logs
sudo kubectl logs -f deployment/backstage -n backstage

# Port forward untuk akses lokal
sudo kubectl port-forward svc/backstage 7007:7007 -n backstage
```

Akses di: http://localhost:7007

## Troubleshooting

### Pod CrashLoopBackOff

```bash
sudo kubectl logs deployment/backstage -n backstage
sudo kubectl describe pod -l app=backstage -n backstage
```

### Database Connection Error

Pastikan PostgreSQL running:
```bash
sudo kubectl get pods -l app=postgres -n backstage
```
