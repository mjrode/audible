# Build images
docker build -t mjrode/audible-client:latest -t mjrode/audible-client:$SHA -f ./client/Dockerfile ./client
docker build -t mjrode/audible-api:latest -t mjrode/audible-api:$SHA -f ./api/Dockerfile ./api

# Push images
docker push mjrode/audible-api:latest
docker push mjrode/audible-client:latest

docker push mjrode/audible-api:$SHA
docker push mjrode/audible-client:$SHA

kubectl apply -f k8s
kubectl set image deployments/api-deployment api=mjrode/audible-api:$SHA
kubectl set image deployments/client-deployment client=mjrode/audible-client:$SHA
