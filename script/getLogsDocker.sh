#!/bin/sh
sudo docker logs `sudo docker ps | grep backlog | cut -d" " -f1`
