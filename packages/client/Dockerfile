FROM node:14.15-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn

COPY ./src ./src
COPY ./public ./public

RUN yarn build

FROM node:14.15-alpine

COPY package.json ./
COPY yarn.lock ./

COPY --from=builder /app/build ./build

RUN yarn global add serve

CMD ["serve", "-s", "build"]
