FROM node:12.18-alpine
WORKDIR /src
COPY package.json /src
RUN npm install
COPY . /src
CMD node app.js
EXPOSE 3000