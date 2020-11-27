FROM node:14.15-alpine AS builder

WORKDIR /server

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn

COPY ./src ./src

RUN yarn build

FROM node:14.15-alpine

COPY package.json ./
COPY yarn.lock ./

RUN yarn add knex

COPY --from=builder /server/dist ./dist

CMD sh -c "yarn migrate_prod && yarn server"
