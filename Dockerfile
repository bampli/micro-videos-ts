FROM node:16.14.0-slim

RUN apt update && \
    apt install -y \
    git \
    ca-certificates \
    default-jre

ENV JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"

USER node

WORKDIR /home/node/app

CMD [ "sh", "-c", "npm install && tail -f /dev/null" ]

#CMD ["tail", "-f", "/dev/null"]

