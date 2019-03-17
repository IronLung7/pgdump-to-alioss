FROM node:alpine
RUN apk add --no-cache postgresql-client 
WORKDIR /usr/src/app
RUN npm config set unsafe-perm true
RUN npm install node-schedule ali-oss minimist
COPY app.js ./
ENTRYPOINT ["node", "app.js"]