#!/bin/bash

base=star-dev.casino.internal
namespace=review
domain=$namespace.$base

# create namespace
res=$(kubectl create namespace $namespace 2>&1)

cat <<DeploymentConfig | kubectl apply -f - --namespace=$namespace
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: review
  labels:
    star-app: review
spec:
  replicas: 1
  strategy: {}
  template:
    metadata:
      labels:
        star-app: review
    spec:
      volumes:
      - name: shared-data
        emptyDir: {}
      containers:
      - name: review-git-sync
        image: git-sync:latest
        imagePullPolicy: Never
        env:
        - name: GIT_SYNC_REPO
          value: https://github.com/yec/review.git
        - name: GIT_SYNC_DEST
          value: "/git"
        - name: GIT_SYNC_BRANCH
          value: "master"
        - name: GIT_SYNC_REV
          value: "FETCH_HEAD"
        - name: GIT_SYNC_WAIT
          value: "300"
        volumeMounts:
        - name: shared-data
          mountPath: /git
      - name: web
        image: review:latest
        imagePullPolicy: Never
        command: ["/usr/local/bin/kubectl"]
        args: ["proxy", "--port=80", "--www=/srv/dist", "--www-prefix=/", "--api-prefix=/k8s", "--address=0.0.0.0", "--accept-hosts=star-dev"]
        volumeMounts:
        - name: shared-data
          mountPath: /srv
        ports:
        - containerPort: 80
status: {}
---
apiVersion: v1
kind: Service
metadata:
  name: review
  labels:
    star-app: review
spec:
  selector:
    star-app: review
  ports:
    - name: http
      protocol: TCP
      port: 80
status:
  loadBalancer: {}
DeploymentConfig

cat <<IngressConfig | kubectl apply -f - --namespace=$namespace
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: review
  annotations:
    ingress.kubernetes.io/enable-cors: "true"
  labels:
    star-app: review
spec:
  rules:
  - host: $domain
    http:
      paths:
      - backend:
          serviceName: review
          servicePort: 80
IngressConfig
