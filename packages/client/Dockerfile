FROM node:14.15-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn

COPY ./src ./src
COPY ./public ./public

ENV REACT_APP_API_URL=http://localhost:3333/api/v1
ENV REACT_APP_HEROKU_API_URL=https://online-games-shop-server.herokuapp.com/api/v1
ENV REACT_APP_IMAGE_HOST_API_KEY=6d207e02198a847aa98d0a2a901485a5

RUN yarn build

RUN yarn global add serve

EXPOSE 80

CMD ["serve", "-s", "build"]
