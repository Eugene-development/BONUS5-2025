FROM --platform=linux/amd64 node:22-alpine

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

ENV HOST 0.0.0.0

EXPOSE 9999

CMD [ "npm", "run", "start" ]
