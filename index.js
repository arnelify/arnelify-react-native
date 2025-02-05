/**
 * @format
 */

import { AppRegistry } from "react-native";

import App from './src/App';
import manifest from "./app.json";

const { name } = manifest;

AppRegistry.registerComponent(name, () => App);

const hasDocument = typeof document !== 'undefined';
if (hasDocument) {

  AppRegistry.runApplication(name, { 
    rootTag: document.getElementById('root'),
    initialProps: {} //some props...
  });
}