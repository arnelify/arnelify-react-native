FROM gcc:15.2.0

WORKDIR /var/www/node

ENV TZ=Europe/Kiev
ENV RUSTUP_HOME=/usr/local/rustup
ENV CARGO_HOME=/usr/local/cargo
ENV PATH=/usr/local/cargo/bin:$PATH

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install sudo nano python3-setuptools libjsoncpp-dev inotify-tools -y
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
  | sh -s -- -y --no-modify-path --default-toolchain 1.92.0  
RUN curl -sL https://deb.nodesource.com/setup_24.x | bash -
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

RUN npm install -g bun@1.3.6 pkg@5.8.1 neon-cli@0.10.1 typescript@5.9.3 yarn@1.22.22
RUN yarn add arnelify-server@1.0.5 react-native-web@0.21.2
RUN yarn add -D esbuild@0.25.0

EXPOSE 3001
EXPOSE 4433