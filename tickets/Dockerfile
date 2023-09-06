FROM node:18.15.0-alpine 

ENV CI=true

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]
