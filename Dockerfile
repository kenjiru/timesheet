FROM node:latest
MAINTAINER kenjiru <kenjiru.ro@gmail.com
EXPOSE 8080
WORKDIR /usr/src/app

ADD . /usr/src/app/

RUN set -x -e && \
echo "######## Installing dependencies" && \
npm set progress=false && \
npm install && \
./node_modules/.bin/tsd install

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]