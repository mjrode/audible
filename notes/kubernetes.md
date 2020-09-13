# K8s

## General notes

- K8s expects all images to already be built
- One config file per object we want to create
- Need to manually setup all networking

# Objects

- Anything that we create inside our K8s cluster
  - StatefulSet
  - ReplicaController
  - Pod
  - Service

## Pod

- Used to run a container
- Grouping of containers with a similar service, smallest thing we can run to host a container.

# Minikube

- `minikube start` creates new VM on your computer, this is referred to as a node. This is used to run different objects.

# Networking

## Node:

- A worker machine in Kubernetes, part of a cluster.

## Cluster:

- A set of Nodes that run containerized applications managed by Kubernetes.
- For this example, and in most common Kubernetes deployments, nodes in the cluster are not part of the public internet.

## Service:

- A Kubernetes Service that identifies a set of Pods using label selectors.
- Unless mentioned otherwise, Services are assumed to have virtual IPs only routable within the cluster network.

## Ingress

- Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster.
- Traffic routing is controlled by rules defined on the Ingress resource.

```
    internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

### Ingress controller

- Is responsible for fulfilling the Ingress, usually with a load balancer, though it may also configure your edge router or additional frontends to help handle the traffic.
- Required by ingress

## Service

### ClusterIP

- Exposes the Service on a cluster-internal IP.
- Choosing this value makes the Service only reachable from within the cluster.
- This is the default ServiceType.

An abstract way to expose an application running on a set of Pods as a network service.

### NodePort

- Exposes a set of pods to the outside world
- Only useful for DEV

### LoadBalancer (Possibly Deprecated)

- Get access to one set of pods
- Reach out to your cloud provider (AWS/GCP) and tell them to create a load balancer
