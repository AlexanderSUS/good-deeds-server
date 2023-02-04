FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

EXPOSE 4000

RUN npm run build

CMD [ "node", "dist/main.js" ]