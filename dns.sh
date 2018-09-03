#!/bin/bash
#
# save having to edit /etc/hosts
# route all subdomains of .localhost to 127.0.0.1

sudo mkdir /etc/resolver
sudo bash -c 'echo "nameserver 127.0.0.1" > /etc/resolver/localhost'
docker run --restart=always --detach -p 53:53/tcp -p 53:53/udp --cap-add=NET_ADMIN andyshinn/dnsmasq:2.75 --address=/localhost/127.0.0.1 --log-facility=-
