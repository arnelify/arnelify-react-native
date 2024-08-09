const path = require("path");
const loader = require("./loader");

const isDevelopment = process.argv.includes('run-web');

const common = {
  allowOverwrite: true,
  bundle: true,
  minify: !isDevelopment,
  sourcemap: isDevelopment,
  format: isDevelopment ? "iife" : "cjs",
  tsconfig: "./tsconfig.json",
  metafile: isDevelopment,
  alias: {
    'react-native': 'react-native-web'
  },
  loader
};

const client = {
  ...common,
  outdir: path.resolve(".", "web"),
  entryPoints: ["./index.js"],
  entryNames: "[dir]/[hash]"
};

const server = {
  ...common,
  outdir: path.resolve(".", "web"),
  entryPoints: [isDevelopment ? "./src/watch.tsx" : "./src/server.tsx"],
  entryNames: "[dir]/server",
  platform: "node"
};

module.exports = { client, server };