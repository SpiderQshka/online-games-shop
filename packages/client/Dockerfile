FROM node:14.15-alpine AS builder

WORKDIR /app

ENV NODE_ENV=development

COPY package.json yarn.lock ./
COPY tsconfig.json ./

RUN yarn install

COPY ./src ./src
COPY ./public ./public

RUN yarn build

FROM node:14.15-alpine

COPY package.json yarn.lock ./

RUN yarn install

COPY --from=builder /app/build ./build

CMD sh -c "yarn serve"
