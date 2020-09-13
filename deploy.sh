# Build images
docker build -t mjrode/audible-client:latest -f ./client/Dockerfile -t mjrode/audible:$SHA ./client
docker build -t mjrode/audible-api:latest -f ./api/Dockerfile -t mjrode/audible:$SHA ./api

# Push images
docker push mjrode/audible-api:latest
docker push mjrode/audible-client:latest
docker push mjrode/audible-api:$SHA
docker push mjrode/audible-client:$SHA

kubectl apply -f k8s
kubectl set image deployments/api-deployment api=mjrode/audible-api:$SHA
kubectl set image deployments/client-deployment client=mjrode/audible-client:$SHA
