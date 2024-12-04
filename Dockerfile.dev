FROM node:21-alpine3.18
WORKDIR /app
COPY . .
RUN ls -a
RUN npm install && npm install -g nodemon

EXPOSE 4001

CMD ["npm", "run", "dev"]