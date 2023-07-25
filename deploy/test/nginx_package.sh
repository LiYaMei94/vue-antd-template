#!/bin/bash
AppName='vue-antd-template'

if [ -z $AppName ]; then
        echo '请输入应用名称'
        exit 2
fi

echo '停止容器开始'
docker ps -a | grep $AppName | awk '{print $1}' | xargs -i docker stop {}
docker ps -a | grep $AppName | awk '{print $1}' | xargs -i docker rm {}
echo '停止容器结束i'

echo '删除镜像开始'
docker images | grep -E $AppName | awk '{print $3}' | uniq | xargs -I {} docker rmi --force {}
echo '删除镜像结束'

echo '打包开始.............'
docker build -f Dockerfile -t $AppName . --no-cache
echo '打包结束............'

echo '运行镜像'
docker run -d --name $AppName -p 80:8099 --restart=always $AppName:latest
