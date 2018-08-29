const app = "nginx";
const name = "nginx";

export function deployment() {
  const namespace = this;
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
          "volumes": [
            {
              "name": "site-data",
              "nfs": {
                "server": "10.133.168.132",
                "path": `/distdata01/review.star-dev.casino.internal`
              }
            }
          ],
          "initContainers": [
            {
              "name": "init-web",
              "image": "alpine/git",
              "volumeMounts": [
                {
                  "name": "site-data",
                  "mountPath": "/git",
                  "subPath": `${namespace.metadata.name}/${app}`
                }
              ],
              "args": [
                "clone",
                "https://github.com/yec/monaco-editor-samples.git",
                "."
              ],
              "imagePullPolicy": "Never"
            }
          ],
          "containers": [
            {
              "name": "web",
              "image": "nginx",
              "ports": [
                {
                  "containerPort": 80,
                  "protocol": "TCP"
                }
              ],
              "volumeMounts": [
                {
                  "name": "site-data",
                  "mountPath": "/usr/share/nginx/html",
                  "subPath": `${namespace.metadata.name}/${app}`
                }
              ],
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
