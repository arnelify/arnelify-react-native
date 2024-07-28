#!/usr/bin/env node

const path = require("path");
const xcopy = require("./esbuild/utils/xcopy");
const exec = require("./utils/exec");
const Plant = require("./utils/plant");
const print = require("./utils/print");
const ESBuild = require("./esbuild");
const remove = require("./utils/remove");

const isBuildWeb = process.argv.includes('build-web');
const isRunWeb = process.argv.includes('run-web');
const isSetup = process.argv.includes('setup');

const build = async () => {
  await ESBuild.build();
  await exec("node ./web/server.js", false);
}

const watch = async () => {
  
  await ESBuild.watch();
  await exec("node ./web/server.js", false);
}

const setup = async () => {

  const rootDir = path.resolve('.');
  const templateDir = path.resolve(__dirname, 'template');

  print('warning', '[Arnelify React Native]: Installing the framework...');
  
  await Plant.add('react-dom');
  await Plant.dev('@types/react-dom');
  await Plant.add('react-native-web');
  await Plant.dev('mime-db');
  await Plant.dev('@types/mime-db');
  await Plant.add('socket.io');
  
  xcopy(templateDir, rootDir);
  await remove("App.tsx");

  print('warning', '[Arnelify React Native]: Checking packages...');

  await Plant.remove('@babel/core');
  await Plant.remove('@babel/preset-env');
  await Plant.remove('@babel/runtime');
  await Plant.remove('@react-native/babel-preset');
  await Plant.remove('babel-jest');
  await remove("babel.config.js");

  print('success', '[Arnelify React Native]: Successful!');
  print('success', '');
}

if (isBuildWeb) build();
if (isRunWeb) watch();
if (isSetup) setup();