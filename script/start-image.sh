#!/bin/sh
/usr/bin/mongod --config /etc/mongod.conf --smallfiles &
su - mean -c'cd appserver/backlog && grunt'
