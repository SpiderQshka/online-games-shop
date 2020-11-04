FROM node:12

# создание директории приложения
WORKDIR /server

# установка зависимостей
# символ астериск ("*") используется для того чтобы по возможности 
# скопировать оба файла: package.json и package-lock.json
ENV PORT=3333
ENV DB_CLIENT=postgres
ENV DN_NAME=postgres
ENV DB_USER=postgres
ENV DB_PASSWORD=password
ENV JWT_SECRET_KEY="secret key"
COPY package.json ./
COPY yarn.lock ./
COPY nodemon.json ./
COPY tsconfig.json ./

RUN yarn
# Если вы создаете сборку для продакшн
# RUN npm ci --only=production

# копируем исходный код
COPY ./src ./src

EXPOSE 3333
CMD [ "yarn", "start" ]