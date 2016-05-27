#!/bin/sh
sudo docker run -d -p 8081:3000 -v /home/mean/appserver:/home/mean/appserver -v /home/mean/storage:/var/lib/mongodb backlog
