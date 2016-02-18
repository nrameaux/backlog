#/bin/sh

# stoppe le mongod de dev
sudo service mongodb stop

# stop le docker de prod
sudo /home/mean/appserver/backlog/stopDocker.sh 

# attente de l'arrêt de la prod
prodStarted=`docker ps | grep -v "grep"| grep -v "CONTAINER" | wc -l`
while [ $prodStarted -gt 0 ]
do
        sleep 3
	prodStarted =`docker ps | grep -v "grep"| grep -v "CONTAINER" | wc -l`
done

# démarrage de mongod sur la base de prod
sudo mongod --dbpath /home/mean/storage &
mongodPid=`echo $!`

sleep 5

# dump de la base
sudo mongodump --out /home/mean/backup

sleep 5

# stop le mongod de la base de prod 
sudo kill $mongodPid 

# attente de l'arrêt mongod
mongodStarted=`ps -ef | grep "mongod" | grep -v "grep"| grep -v "sudo" | wc -l`
while [ $mongodStarted -gt 0 ]
do
	sleep 3
	mongodStarted=`ps -ef | grep "mongod" | grep -v "grep" | grep -v "sudo" | wc -l`
done

# redémarre le docker de prod
sudo /home/mean/appserver/backlog/startDocker.sh

# redémarre le mongod de dev
sudo service mongodb start

exit 0

