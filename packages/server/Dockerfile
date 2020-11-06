FROM node:12.19-alpine

WORKDIR /server

ENV PORT=3333
ENV DB_CLIENT=postgres
ENV DN_NAME=postgres
ENV DB_USER=postgres
ENV DB_PASSWORD=password
ENV JWT_SECRET_KEY="secret key"
ENV DB_HOST=db

COPY package.json ./
COPY yarn.lock ./
COPY nodemon.json ./
COPY tsconfig.json ./

RUN yarn

COPY ./src ./src

RUN yarn global add tsc

RUN yarn tsc

CMD ["node", "--inspect", "-r", "ts-node/register", "-r", "dotenv/config", "-r", "tsconfig-paths/register", "./dist/index.js"]