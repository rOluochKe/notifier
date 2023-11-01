# notifier

## Setup

1. Clone the Project: `git clone <repository-url>`
2. Install Dependencies: `cd notifier` and `npm install`
3. Configure the .env File: create `.env` file based on `.env.example` file
4. Deploy to Kubernetes: `cd k8s` and run `kubectl apply -f k8s-deployment.yaml`
5. Check Deployment and Service: `kubectl get deployments` and `kubectl get services`
