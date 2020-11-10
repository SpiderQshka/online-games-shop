FROM node:12.19-alpine AS client_builder

WORKDIR /app/client

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn

COPY ./src ./src
COPY ./public ./public

RUN yarn build

RUN yarn global add serve

EXPOSE 80

# CMD ["serve", "-s", "build"]

FROM node:12.19-alpine AS server_builder

WORKDIR /app/server

ENV PORT=80
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

# CMD ["node", "--inspect", "-r", "ts-node/register", "-r", "dotenv/config", "-r", "tsconfig-paths/register", "./dist/index.js"]

FROM alpine:latest

RUN apk --no-cache add ca-certificates
COPY --from=client_builder /dest ./server
COPY --from=server_builder /build ./web
RUN chmod +x ./dest/index
EXPOSE 8080
CMD ./dest/index