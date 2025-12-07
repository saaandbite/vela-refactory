#jika perlu ganti password database atau config lain jalankan ini
# 1. Install & Build Code (Node.js)
yarn install --immutable
yarn tsc
yarn build:backend

# 2. Build & Push Image (Docker)
# Build image di laptop lokal
sudo docker build . --network=host -f packages/backend/Dockerfile -t saaandd/backstage:1.0.0
#sudo docker build . -f packages/backend/Dockerfile -t saaandd/backstage:1.0.0

# [BARU] Upload image ke Docker Hub agar bisa didownload oleh Cluster Kubernetes
sudo docker push saaandd/backstage:1.0.0

# 3. Deploy ke Kubernetes
# Update password/kredensial database (jika ada perubahan)
sudo kubectl apply -f kubernetes/secrets.yaml

# [DIHAPUS] sudo kubectl apply -f kubernetes/postgres.yaml 
# Alasannya: Kita pakai DB External, bukan DB di dalam cluster.

# Update aplikasi Backstage (akan menarik image baru saaandd/backstage:1.0.0)
# Pastikan deployment.yaml Anda memiliki 'imagePullPolicy: Always' agar selalu update
sudo kubectl apply -f kubernetes/k8s-backstage.yaml

# Update Networking (jika ada perubahan config port/domain)
sudo kubectl apply -f kubernetes/service.yaml
sudo kubectl apply -f kubernetes/ingress.yaml

# 4. Restart Pod (Opsional tapi Disarankan)
# Kadang K8s tidak sadar ada image baru jika tag-nya sama (1.0.0). 
# Perintah ini memaksa restart agar mengambil image terbaru.
sudo kubectl rollout restart deployment/backstage-deployment -n backstage

# 5. Verifikasi & Monitoring
sudo kubectl get pods -n backstage
sudo kubectl get ingress -n backstage
sudo kubectl logs -f deployment/backstage-deployment -n backstage


#jika perbhana di kode saja jalankan ini setiap ada perubahan
# 1. BUILD KODE (Di Laptop)
yarn install --immutable
yarn tsc
yarn build:backend

# 2. UPDATE IMAGE (Di Laptop -> Docker Hub)
# Timpa image lama dengan code baru
sudo docker build . -f packages/backend/Dockerfile -t saaandd/backstage:1.0.0
sudo docker push saaandd/backstage:1.0.0

# 3. DEPLOY & RESTART (Di Cluster)
# Apply ulang deployment (hanya untuk memastikan config aman)
kubectl apply -f kubernetes/k8s-backstage.yaml

# --- INI KUNCINYA ---
# Perintah ini memaksa Kubernetes mematikan pod lama & download image baru
kubectl rollout restart deployment/backstage-deployment -n backstage