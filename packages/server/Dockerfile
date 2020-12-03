FROM node:14.15-alpine AS builder

WORKDIR /server

ENV NODE_ENV=development

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install

COPY ./src ./src

RUN yarn build

FROM node:14.15-alpine

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY --from=builder /server/dist ./dist

CMD sh -c "yarn production"