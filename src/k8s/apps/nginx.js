const app = "nginx";
const name = "nginx";

export function deployment() {
  return {
    "kind": "Deployment",
    "apiVersion": "extensions/v1beta1",
    "metadata": {
      name,
      "labels": {
        app
      },
      "annotations": {}
    },
    "spec": {
      "replicas": 1,
      "selector": {
        "matchLabels": {
          app
        }
      },
      "template": {
        "metadata": {
          "labels": {
            app
          }
        },
        "spec": {
          "containers": [
            {
              "name": "web",
              "image": "nginx:latest",
              "ports": [
                {
                  "containerPort": 80,
                  "protocol": "TCP"
                }
              ],
              "resources": {
              },
              "imagePullPolicy": "Never"
            }
          ],
        }
      },
    },
  };
}

export function service() {
  return {
    "kind": "Service",
    "apiVersion": "v1",
    "metadata": {
      name,
      "labels": {
        app
      },
      "annotations": {}
    },
    "spec": {
      "ports": [
        {
          "name": "http",
          "protocol": "TCP",
          "port": 80,
          "targetPort": 80
        }
      ],
      "selector": {
        app
      },
    },
  };
}

export function ingress() {
  const namespace = this;
  return {
    "kind": "Ingress",
    "apiVersion": "extensions/v1beta1",
    "metadata": {
      name,
      "labels": {
        app
      },
      "annotations": {}
    },
    "spec": {
      "rules": [
        {
          "host": `${app}.${namespace.metadata.name}.star-dev.casino.internal`,
          "http": {
            "paths": [
              {
                "backend": {
                  "serviceName": name,
                  "servicePort": 80
                }
              }
            ]
          }
        }
      ]
    },
  };
}
