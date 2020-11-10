FROM node:12.19-alpine AS client_builder

WORKDIR /app/client

COPY packages/client/package.json ./
COPY packages/client/yarn.lock ./
COPY packages/client/tsconfig.json ./

RUN yarn

COPY packages/client/src ./src
COPY packages/client/public ./public

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

COPY packages/server/package.json ./
COPY packages/server/yarn.lock ./
COPY packages/server/nodemon.json ./
COPY packages/server/tsconfig.json ./

RUN yarn

COPY packages/server/src ./src

RUN yarn global add tsc

RUN yarn tsc

# CMD ["node", "--inspect", "-r", "ts-node/register", "-r", "dotenv/config", "-r", "tsconfig-paths/register", "./dist/index.js"]

FROM node:12.19-alpine

RUN apk --no-cache add ca-certificates
COPY --from=server_builder /dest ./server
COPY --from=client_builder /build ./web
EXPOSE 8080
# CMD ./dest/index
CMD node --inspect -r ts-node/register -r dotenv/config -r tsconfig-paths/register ./dist/index.js && serve -s build