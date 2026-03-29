<img src="https://static.wikia.nocookie.net/arnelify/images/c/c8/Arnelify-logo-2024.png/revision/latest?cb=20240701012515" style="width:336px;" alt="Arnelify Logo" />

![Arnelify](https://img.shields.io/badge/Arnelify%20React%20Native-1.0.5-yellow) ![NodeJS](https://img.shields.io/badge/NodeJS-24.13.1-green) ![Bun](https://img.shields.io/badge/Bun-1.3.6-blue)

## 🚀 About
**Arnelify React Native** - is a FrontEnd-Framework for building Cross-Platform UI with HTTP 3.0 and WebTransport support.

Write one code and convert it into:

✅ A native iOS app written in Swift.<br/>
✅ A native Android app written in Java.<br/>
✅ A native Web: JS, CSS and HTML.<br/>

## 📋 Minimal Requirements
> Important: It's strongly recommended to use in a container that has been built from the gcc v15.2.0 image.

> Important: It is recommended to use React Native version 0.8.4.

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
npm run watch
```
Build and run the Web binaries:
```
npm run build && ./web/server
```
Run Metro:
```
npm run native
```
## 📚 Code Examples

You can find code examples <a href="https://github.com/arnelify/arnelify-react-native/blob/main/src/App.tsx">here</a>.

## ⚖️ MIT License
This software is licensed under the <a href="https://github.com/arnelify/arnelify-react-native/blob/main/LICENSE">MIT License</a>. The original author's name, logo, and the original name of the software must be included in all copies or substantial portions of the software.

## 🛠️ Contributing
Join us to help improve this software, fix bugs or implement new functionality. Active participation will help keep the software up-to-date, reliable, and aligned with the needs of its users.

## ⭐ Release Notes
Version 1.0.5 - is a FrontEnd-Framework for building Cross-Platform UI with HTTP 3.0 and WebTransport support.

We are excited to introduce the Arnelify React Native framework! Please note that this version is raw and still in active development.

Change log:

* HTTP 3.0 + WebTransport.
* Security-aware logging with attack detection.
* Compiling code into a binary executable.
* Compatible with Bun and V8.
* Significant refactoring and optimizations.

Please use this version with caution, as it may contain bugs and unfinished features. We are actively working on improving and expanding the framework's capabilities, and we welcome your feedback and suggestions.

## 🔗 Links

* <a href="https://github.com/arnelify/arnelify-pod-cpp">Arnelify POD for C++</a>
* <a href="https://github.com/arnelify/arnelify-pod-node">Arnelify POD for NodeJS</a>
* <a href="https://github.com/arnelify/arnelify-pod-python">Arnelify POD for Python</a>
* <a href="https://github.com/arnelify/arnelify-pod-rust">Arnelify POD for Rust</a>
* <a href="https://github.com/arnelify/arnelify-react-native">Arnelify React Native</a>