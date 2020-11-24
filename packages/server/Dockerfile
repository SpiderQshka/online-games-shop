FROM node:14.15-alpine AS builder

WORKDIR /server

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn

COPY ./src ./src

RUN yarn build

FROM node:14.15-alpine

ENV PORT=80
ENV DB_CLIENT=postgres
ENV DN_NAME=postgres
ENV DB_USER=postgres
ENV DB_PASSWORD=password
ENV JWT_SECRET_KEY="secret key"
ENV DB_HOST=db
ENV IMAGE_HOST_API_KEY=6d207e02198a847aa98d0a2a901485a5

COPY package.json ./
COPY yarn.lock ./

RUN yarn add knex

COPY --from=builder /server/dist ./dist

CMD sh -c "yarn migrate_prod && yarn server"
