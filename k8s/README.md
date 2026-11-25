# Kubernetes and Argo CD

Argo CD uses a pull-based deployment model: it reads the manifests from this Git repository and continuously reconciles the cluster to the declared state. The repository must be pushed to GitHub before Argo CD can sync it.

## Configure before deploying

1. `argocd/application.yaml` should point to the GitHub repository and branch containing these manifests.
2. The image references use the Docker Hub account `saurabhkumbhar7`. Build and push the images from the existing Dockerfiles, then commit and push the manifests to GitHub. Argo CD deploys images; it does not build them. For each release, publish a new versioned tag and update the matching tag in Git; that Git change triggers a rollout.

Build and publish the initial `v1` images from the project root (replace the username first):

```powershell
docker login --username saurabhkumbhar7
docker build -t docker.io/saurabhkumbhar7/bikes-backend:v1 ./backend
docker build -t docker.io/saurabhkumbhar7/bikes-frontend:v1 ./frontend
docker build -t docker.io/saurabhkumbhar7/bikes-mongodb:v1 ./mongodb
docker push docker.io/saurabhkumbhar7/bikes-backend:v1
docker push docker.io/saurabhkumbhar7/bikes-frontend:v1
docker push docker.io/saurabhkumbhar7/bikes-mongodb:v1
```

At the Docker login password prompt, use a Docker Hub access token with permission to push images. Keep the token out of command history and Git.
3. Ensure the Kubernetes cluster has a default StorageClass capable of provisioning a 5Gi `ReadWriteOnce` volume. The MongoDB StatefulSet is intentionally a single replica; it is persistent but not a highly available MongoDB replica set.
4. Create the runtime Secret outside Git. Choose strong values and keep them out of source control. Keep the app password URI-safe (letters, numbers, `_`, or `-`) because the backend builds its MongoDB connection URI from it:

```powershell
kubectl create namespace bikes
kubectl create secret generic bikes-secrets -n bikes `
  --from-literal=MONGO_ROOT_USER=admin `
  --from-literal=MONGO_ROOT_PASSWORD='<strong-root-password>' `
  --from-literal=MONGO_APP_DB=bikesdb `
  --from-literal=MONGO_APP_USER=bikeapp `
  --from-literal=MONGO_APP_PASSWORD='<strong-uri-safe-app-password>'
```

For private Docker Hub repositories, configure an `imagePullSecret` in the `bikes` namespace and reference it from each workload's pod spec. Public repositories do not need a pull secret.

## Install and sync

Install Argo CD in the cluster, then apply the Application resource:

```powershell
kubectl apply -n argocd -f k8s/argocd/application.yaml
```

Argo CD will pull `k8s/base` from the configured branch, create the `bikes` namespace, and automatically sync changes. Automated pruning removes resources deleted from Git; self-healing reverts manual drift in the cluster.

The frontend Service is `LoadBalancer`. On local clusters without a load balancer, use `kubectl port-forward -n bikes svc/frontend 8080:80` and open `http://localhost:8080`.

The backend uses the existing `/api/health` endpoint for readiness, and MongoDB initialization continues to come from `mongodb/init-mongo.js` baked into the MongoDB image. The PersistentVolumeClaim retains database files across pod replacement.