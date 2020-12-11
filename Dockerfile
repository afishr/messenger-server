FROM node:14-slim

RUN useradd -s /bin/bash user


RUN mkdir /usr/src/app
# USER user

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# USER root

RUN chmod -R 1555 /usr/src/app

USER user

EXPOSE 8080
CMD [ "node", "app.js" ]