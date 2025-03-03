FROM gcc:14.2.0

WORKDIR /var/www/node

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install sudo nano libjsoncpp-dev inotify-tools -y

RUN curl -sL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install nodejs -y

COPY ./.env ./.env
COPY ./.gitignore ./.gitignore
COPY ./app.json ./app.json
COPY ./babel.config.js ./babel.config.js
COPY ./index.js ./index.js
COPY ./jest.config.js ./jest.config.js
COPY ./LICENSE ./LICENSE
COPY ./package.json ./package.json
COPY ./README.md ./README.md
COPY ./tsconfig.json ./tsconfig.json
COPY ./yarn.lock ./yarn.lock

RUN npm install -g bun@1.2.0 node-gyp@11.0.0 pkg@5.8.1 yarn@1.22.22
RUN yarn add arnelify-server@0.6.0 react-native-web
RUN yarn add -D esbuild@0.24.2 @types/ws

CMD ["./web/server"]

EXPOSE 3000