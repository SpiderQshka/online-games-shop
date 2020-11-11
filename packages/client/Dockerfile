FROM node:12.19-alpine

# USER node

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn

COPY ./src ./src
COPY ./public ./public

ENV API_URL=http://localhost:3333/api/v1

RUN yarn build

RUN yarn global add serve

EXPOSE 80

CMD ["serve", "-s", "build"]
