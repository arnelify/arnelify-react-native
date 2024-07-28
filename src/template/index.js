/**
 * @format
 */

import { AppRegistry } from "react-native";

import App from './src/App';
import env from "./app.json";

AppRegistry.registerComponent(env.name, () => App);

const hasDocument = typeof document !== 'undefined';

if (hasDocument) {
  AppRegistry.runApplication(env.name, {
    initialProps: {},
    rootTag: document.getElementById('root'),
  });
}