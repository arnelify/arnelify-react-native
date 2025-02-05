<img src="https://static.wikia.nocookie.net/arnelify/images/c/c8/Arnelify-logo-2024.png/revision/latest?cb=20240701012515" style="width:336px;" alt="Arnelify Logo" />

![Arnelify](https://img.shields.io/badge/Arnelify%20React%20Native-0.5.9-yellow) ![C++](https://img.shields.io/badge/C++-2b-red) ![G++](https://img.shields.io/badge/G++-14.2.0-blue) ![NodeJS](https://img.shields.io/badge/NodeJS-22.13.1-green) ![Bun](https://img.shields.io/badge/Bun-1.2.0-blue)

## 🚀 About
**Arnelify React Native** - is a framework for creating Cross-Platform applications.

Write one code and convert it into:

✅ A native iOS app written in Swift.<br/>
✅ A native Android app written in Java.<br/>
✅ A native Web: JS, CSS and HTML.<br/>

## 📋 Minimal Requirements
> Important: It's strongly recommended to use in a container that has been built from the gcc v14.2.0 image.
* CPU: Apple M1 / Intel Core i7 / AMD Ryzen 7
* OS: Debian 11 / MacOS 15 / Windows 10 with <a href="https://learn.microsoft.com/en-us/windows/wsl/install">WSL2</a>.
* RAM: 4 GB

## 🧰 Before Installation
Start a pure <a href="https://github.com/facebook/react-native">React Native</a> project:
```
npx @react-native-community/cli@latest init NewProject
```
Go to NewProject folder:
```
cd ./NewProject
```
Run diagnostics inside the NewProject folder:
```
npx react-native doctor
```
## 📦 Installation
Run inside the NewProject folder:
```
npx arnelify-react-native setup
```
Create .env:
```
cp ./.env.local ./.env
```
Run Web container:
```
docker compose up -d
docker ps
docker exec -it <CONTAINER_ID> bash
```
## 🎉 Usage
Start the Web development:
```
yarn watch
```
Build and run the Web binaries:
```
yarn build && ./web/server
```
Run iOS or Android app:
```
yarn native
```
## 📚 Documentation

<a href="https://github.com/arnelify/arnelify-server-node">Arnelify Server</a> for NodeJS (Bun) is used for SSR rendering.

## ⚖️ MIT License
This software is licensed under the <a href="https://github.com/arnelify/arnelify-react-native/blob/main/LICENSE">MIT License</a>. The original author's name, logo, and the original name of the software must be included in all copies or substantial portions of the software.

## 🛠️ Contributing
Join us to help improve this software, fix bugs or implement new functionality. Active participation will help keep the software up-to-date, reliable, and aligned with the needs of its users.

## ⭐ Release Notes
Version 0.5.9 - New Core

We are excited to introduce the Arnelify React Native framework! Please note that this version is raw and still in active development.

Change log:

* Replaced the <a href="https://github.com/v8/v8">Node.js V8</a> engine with <a href="https://github.com/oven-sh/bun">NodeJS Bun</a>.
* Replaced <a href="https://github.com/nodejs/node">node-http</a> with <a href="https://github.com/arnelify/arnelify-server-node">arnelify-server</a>.
* Removed dependencies: formidable, mime-db, moment, socket.io, @types/mime-db.
* Added support for compiling code into a binary executable.
* Significant refactoring and optimizations

Please use this version with caution, as it may contain bugs and unfinished features. We are actively working on improving and expanding the framework's capabilities, and we welcome your feedback and suggestions.