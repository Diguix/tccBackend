# referência
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# para construir
# docker build -t $USER/bot-conta .
# para usar:
# docker run -p 3000:3000 -d $USER/bot-conta
FROM node:alpine

# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install 
# If you are building your code for production
# RUN npm ci --only=production

COPY . . 

EXPOSE 3000

CMD [ "npm", "start" ]
