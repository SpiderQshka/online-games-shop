FROM node:14.15-alpine AS builder

WORKDIR /server

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
COPY tsconfig.json ./
COPY knexfile.ts ./

RUN yarn

COPY ./src ./src

RUN yarn global add tsc

RUN yarn tsc


FROM node:14.15-alpine

COPY package.json ./
COPY yarn.lock ./

RUN yarn global add knex

COPY --from=builder /server/dist .

CMD sh -c "yarn migrate && yarn seed && yarn server"