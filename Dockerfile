FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --include=optional sharp

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
