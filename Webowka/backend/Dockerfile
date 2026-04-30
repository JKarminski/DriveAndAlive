FROM node:18-alpine

WORKDIR /app

# Kopiujemy najpierw pliki pakietów, żeby wykorzystać cache warstw Dockera
COPY package*.json ./

RUN npm install

# Kopiujemy resztę aplikacji
COPY . .

EXPOSE 4000

CMD ["npm", "start"]
