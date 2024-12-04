FROM node:21-alpine3.18 as builder

WORKDIR /app
COPY . .
RUN npm install -g npm@latest
RUN npm ci && npm run build

FROM node:21-alpine3.18 as builder

WORKDIR /app
RUN apk add --no-cache curl
COPY . .
RUN npm install -g pm2 npm@latest
RUN npm ci --production
COPY --from=builder /app/build ./build

EXPOSE 4001

CMD ["npm", "run", "start "]