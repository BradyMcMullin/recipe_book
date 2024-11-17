# Recipe Book Application Deployment

This repository contains Docker and Kubernetes configuration files for deploying a Recipe Book application with two components: frontend and backend.

## Prerequisites

- Docker
- Kubernetes cluster (e.g., MicroK8s, EKS)
- kubectl configured
- Docker Hub account

## Docker Setup

### 1. Build Docker Containers
For Frontend:
docker build -t dylanstoddard134/recipe-book-frontend:latest .
For Backend:
docker build -t dylanstoddard134/recipe-book-backend:latest .

### 2. Push Docker Containers to Docker Hub
For Frontend:
docker push dylanstoddard134/recipe-book-frontend:latest
For Backend:
docker push dylanstoddard134/recipe-book-backend:latest

## Kubernetes Deployment

### 1. Apply Kubernetes YAML Files
Apply the frontend and backend deployments, services, and ingress configuration:
kubectl apply -f frontend-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f ingress.yaml

### 2. Verify the Deployment
Check the status of pods, services, and ingress:
kubectl get pods
kubectl get svc
kubectl get ingress

## Accessing the Application
The application will be accessible via the ingress. Make sure your Kubernetes ingress controller is set up properly to route traffic.

## Scaling the Frontend
To scale the frontend, you can adjust the number of replicas. For example, to scale to 3 replicas:
kubectl scale deployment recipe-book-frontend --replicas=3

## Notes
- The backend should only have one replica.
- Ensure the ingress controller is correctly set up for external access.


# Resource: 
Recipe

## Attributes
The "Recipe" resource will have the following attributes:

1. **name** (String): The name of the recipe.
2. **ingredients** (String): A comma-separated list of ingredients required for the recipe.
3. **comment** (String): Additional comments or notes about the recipe.
4. **calories** (Number): The number of calories per serving.
5. **size** (String): The size or number of servings the recipe yields.
6. **time** (String): The time required to prepare and cook the recipe.

## Schema

```sql
CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    comment TEXT NOT NULL,
    calories INTEGER,
    size TEXT,
    time TEXT
);
```
# REST Endpoints

| **Name**                    | **Method** | **Path**            |
|-----------------------------|------------|---------------------|
| Retrieve recipe collection  | GET        | `/recipes`          |
| Retrieve recipe member      | GET        | `/recipes/<id>`     |
| Create recipe member        | POST       | `/recipes`          |
| Update recipe member        | PUT        | `/recipes/<id>`     |
| Delete recipe member        | DELETE     | `/recipes/<id>`     |
