yarn install --immutable
yarn tsc
yarn build:backend
sudo docker build . -f packages/backend/Dockerfile -t saaandd/backstage:1.0.0
sudo kubectl apply -f kubernetes/secrets.yaml
sudo kubectl apply -f kubernetes/postgres.yaml
sudo kubectl apply -f kubernetes/deployment.yaml
sudo kubectl apply -f kubernetes/service.yaml
sudo kubectl apply -f kubernetes/ingress.yaml
sudo kubectl get pods -n backstage
sudo kubectl get ingress -n backstage
sudo kubectl logs -f deployment/backstage -n backstage
