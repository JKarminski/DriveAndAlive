FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Flaga --host sprawia, że kontener wystawia serwer deweloperski na świat zewnątrz
CMD ["npm", "run", "dev", "--", "--host"]
