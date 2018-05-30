open command line
kubectl proxy --kubeconfig="C:\data\lucasjellemag-oci\kubeconfig"

open command line in 
C:\data\1-nlOUG-techexperience-7_8_june-2018\IntroductiontotheOracleCloudMicroservicesPlatform\request-counter-on-k8s\kubernetes

set KUBECONFIG="C:\data\lucasjellemag-oci\kubeconfig"

# to create the shared ingress
(see https://docs.us-phoenix-1.oraclecloud.com/Content/ContEng/Tasks/contengsettingupingresscontroller.htm
maybe better:
https://akomljen.com/kubernetes-nginx-ingress-controller/

)


kubectl create namespace ingress

kubectl apply -f nginx-default-backend-deployment.yaml

kubectl apply -f nginx-default-backend-service.yaml	

kubectl apply -f nginx-ingress-controller-deployment.yaml
	
kubectl apply -f nginx-ingress-controller-service.yaml	

kubectl apply -f nginx-ingress-service-account-rbac.yaml

kubectl get svc


nginx-ingress-controller: 130.61.70.93


create secret (in Ubuntu VM:  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=nginxsvc/O=nginxsvc")

kubectl create secret tls tls-secret --key tls.key --cert tls.crt

NOw: deploy the deployment

kubectl apply  -f deployment.yaml

this should create a deployment, a replicaset and two pods as well as service of type nodeport

kubectl get pods
should reveal two pods, not yet ready

open bash in a pod in the cluster - any pod in the default namespace

does not work:


curl http://requestcounterservice

echo $DETAILS_SERVICE_HOST

to get the intra-cluster IP and PORT for a service:

echo $REQUESTCOUNTERSERVICE_SERVICE_HOST
echo $REQUESTCOUNTERSERVICE_SERVICE_PORT

or find from Dashboard/kubectl get svc the ClusterIP

using this endpoint will result in load balancing across all pods covered by the service


local: 

kubectl exec -it sleep-85d4b9b74d-d54n6 -- /bin/bash

in this container, I can execute:

 curl http://10.96.232.195:8091

 to requestcounter-service service and PORT


 Deploy Redis on Kubernetes:
 https://kubernetes.io/docs/tutorials/stateless-application/guestbook/#start-up-the-redis-master

 (or more elaborately:  https://kubernetes.io/docs/tutorials/configuration/configure-redis-using-configmap/)

 kubectl apply -f redis-master-deployment.yaml


Rollout new version of request counter

kubectl create -f deployment-v2.yaml --record


 



 http://130.61.75.65:30624/