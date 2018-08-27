const app = "starplay";
const name = "starplay";

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
              "name": "shared-data",
              "emptyDir": {}
            },
            {
              "name": "site-data",
              "nfs": {
                "server": "10.133.168.132",
                "path": "/distdata01"
              }
            }
          ],
          "containers": [
            {
              "name": "web",
              "image": "starplay:latest",
              "command": [
                "/bin/bash"
              ],
              "args": [
                "-c",
                "/usr/bin/supervisord",
              ],
              "ports": [
                {
                  "containerPort": 80,
                  "protocol": "TCP"
                }
              ],
              "env": [
                {
                  "name": "GIT_BRANCH",
                  "value": namespace.metadata.annotations.branch
                },
                {
                  "name": "MYSQL_HOST",
                  "value": "mysql"
                }
              ],
              "resources": {
                "requests": {
                  "cpu": "300m",
                  "memory": "1Gi"
                }
              },
              "volumeMounts": [
                {
                  "name": "shared-data",
                  "mountPath": "/var/www/edit"
                },
                {
                  "name": "site-data",
                  "mountPath": "/mnt"
                }
              ],
              "imagePullPolicy": "Never"
            }
          ]
        }
      },
    }
  }
};

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
  const namespace = this
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

