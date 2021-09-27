FROM node:14

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN ls
RUN npm install
COPY . .

EXPOSE 8000

CMD ["node", "server.js"]