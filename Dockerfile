FROM node:14-alpine as build

WORKDIR /home/node
COPY . /home/node
RUN npm install
RUN npm install -g pm2
RUN npm run build

CMD ["pm2-runtime", "./dist/main.js"]

