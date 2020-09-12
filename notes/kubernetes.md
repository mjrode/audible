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
* Used to run a container
* Grouping of containers with a similar service, smallest thing we can run to host a container.
* 

## Service
An abstract way to expose an application running on a set of Pods as a network service.

# Minikube
* `minikube start` creates new VM on your computer, this is referred to as a node. This is used to run different objects.
*