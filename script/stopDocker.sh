#!/bin/sh
sudo docker stop ` sudo docker ps | grep backlog | cut -d" " -f1`
