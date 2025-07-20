FROM --platform=linux/amd64 node:22-alpine

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

# Copy and setup entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV HOST 0.0.0.0

EXPOSE 9999

ENTRYPOINT ["/entrypoint.sh"]
CMD [ "npm", "run", "start" ]
