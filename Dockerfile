FROM node

WORKDIR /app

COPY package.json ./

RUN npm install 

COPY . .

EXPOSE 7542

CMD ["node", "./index.ts"]