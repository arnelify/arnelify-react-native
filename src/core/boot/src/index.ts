#!/usr/bin/env node

/**
 * MIT LICENSE
 *
 * COPYRIGHT (R) 2025 ARNELIFY. AUTHOR: TARON SARKISYAN
 *
 * PERMISSION IS HEREBY GRANTED, FREE OF CHARGE, TO ANY PERSON OBTAINING A COPY
 * OF THIS SOFTWARE AND ASSOCIATED DOCUMENTATION FILES (THE "SOFTWARE"), TO DEAL
 * IN THE SOFTWARE WITHOUT RESTRICTION, INCLUDING WITHOUT LIMITATION THE RIGHTS
 * TO USE, COPY, MODIFY, MERGE, PUBLISH, DISTRIBUTE, SUBLICENSE, AND/OR SELL
 * COPIES OF THE SOFTWARE, AND TO PERMIT PERSONS TO WHOM THE SOFTWARE IS
 * FURNISHED TO DO SO, SUBJECT TO THE FOLLOWING CONDITIONS:
 *
 * THE ABOVE COPYRIGHT NOTICE AND THIS PERMISSION NOTICE SHALL BE INCLUDED IN ALL
 * COPIES OR SUBSTANTIAL PORTIONS OF THE SOFTWARE.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import path from "path";
import { readFile } from "fs/promises";

import Plant from "./plant";
import Logger from "./logger";
import Watcher from "./watcher";

/**
 * Boot
 */
class Boot {

  /**
   * Setup
   */
  static async setup(react: string, native: string): Promise<void> {
    const lib_path: string = path.resolve(path.join(__dirname, '../../../../'));
    const root_path: string = path.resolve('.');

    await Plant.exec('npm pkg delete scripts.ios');
    await Plant.exec('npm pkg delete scripts.android');
    await Plant.exec('npm pkg delete scripts.start');
    await Plant.exec('npm pkg delete scripts.test');

    Logger.warning("Removing unnecessary packages: 'prettier'...");
    await Plant.exec('npm uninstall prettier');
    await Plant.xrm(path.resolve(path.join(root_path, '.prettierrc.js')));

    Logger.warning("Removing unnecessary packages: 'eslint'...", 128);
    await Plant.xrm(path.resolve(path.join(root_path, '.eslintrc.js')));
    await Plant.exec('npm uninstall @react-native/eslint-config');
    await Plant.exec('npm pkg delete scripts.lint');
    await Plant.exec('npm uninstall eslint');

    Logger.warning("Removing unnecessary packages...\n", 128);
    Logger.warning(`Installing framework...\n`);

    await Plant.xrm(path.resolve(path.join(root_path, 'App.tsx')));
    await Plant.xrm(path.resolve(path.join(root_path, 'package-lock.json')));
    await Plant.mkdir(path.resolve(path.join(root_path, 'src/app/locales')));
    await Plant.mkdir(path.resolve(path.join(root_path, 'src/app/layouts')));
    await Plant.mkdir(path.resolve(path.join(root_path, 'src/app/middleware')));
    await Plant.mkdir(path.resolve(path.join(root_path, 'src/app/pages')));
    await Plant.mkdir(path.resolve(path.join(root_path, 'src/tests')));

    const exclude: string[] = [
      path.resolve(path.join(root_path, '.git')),
      path.resolve(path.join(root_path, 'node_modules')),
      path.resolve(path.join(root_path, 'src/core')),
      path.resolve(path.join(root_path, 'LICENSE')),
      path.resolve(path.join(root_path, 'package.json')),
      path.resolve(path.join(root_path, 'README.md')),
      path.resolve(path.join(root_path, 'yarn.lock'))
    ];

    await Plant.xcopy(lib_path, root_path, exclude);
    const root_git_path = path.resolve(path.join(root_path, '.gitignore'));
    const lib_git_path = path.resolve(path.join(lib_path, '.gitignore'));
    await Plant.xcopy(lib_git_path, root_git_path);
    
    await Plant.mkdir(path.resolve(path.join(root_path, 'src/core/env')));
    const lib_boot_path: string = path.resolve(path.join(lib_path, 'src/core/boot/bin'));
    const root_boot_path: string = path.resolve(path.join(root_path, 'src/core/boot/bin'));
    await Plant.xcopy(lib_boot_path, root_boot_path);

    const lib_logger_path: string = path.resolve(path.join(lib_path, 'src/core/logger'));
    const root_logger_path: string = path.resolve(path.join(root_path, 'src/core/logger'));
    await Plant.xcopy(lib_logger_path, root_logger_path);

    let build_script: string = 'clear ';
    build_script += '&& bun ./src/core/boot/bin/index.js build ';
    build_script += '&& pkg ./web/server.js --targets node18-linux-arm64 --output ./web/server ';
    build_script += '&& rm ./web/server.js';

    await Plant.exec(`npm pkg set scripts.build="${build_script}"`);

    let watch_script: string = 'clear ';
    watch_script += '&& bun ./src/core/boot/bin/index.js watch';
    await Plant.exec(`npm pkg set scripts.watch="${watch_script}"`);

    let native_script: string = 'clear ';
    native_script += '&& react-native start';
    await Plant.exec(`npm pkg set scripts.native="${native_script}"`);

    let jest_script: string = 'clear ';
    jest_script += '&& jest';
    await Plant.exec(`npm pkg set scripts.test="${jest_script}"`);

    Logger.warning(`Installing packages: 'react-dom@${react}'...`);
    await Plant.exec(`npm install react-dom@${react} --save-exact`);
    await Plant.exec(`npm install -D @types/react-dom@${react}`);

    Logger.warning("Installing packages...\n", 128);
    Logger.success("Successfully!\n");
  }

  /**
   * Build
   */
  static async build(): Promise<void> {
    const env_path: string = path.resolve('./.env');
    const watch_path: string = path.resolve('./src/server.tsx');
    const server_path: string = path.resolve('./web/server');

    const watcher: Watcher = new Watcher();
    await watcher.apply(env_path);
    await watcher.build(watch_path, server_path);
  }

  /**
   * Watch
   */
  static async watch(): Promise<void> {
    const env_path: string = path.resolve('./.env');
    const watch_path: string = path.resolve('./src/watch.tsx');
    const server_path: string = path.resolve("./web/server");

    const watcher: Watcher = new Watcher();
    await watcher.apply(env_path);
    await watcher.build(watch_path, server_path);
    watcher.start(watch_path);
    await watcher.watch(watch_path, server_path);
  }
}

/**
 * Main
 * @returns
 */
(async function main(): Promise<void> {

  const vendor_path: string = path.resolve('./vendor');
  const isOS: boolean = await Plant.exists(vendor_path);

  const packagePath: string = path.resolve('./package.json');
  const exists: boolean = await Plant.exists(packagePath);
  if (!exists) {
    Logger.danger("Use 'setup' in root folder of React Native project.\n");
    process.exit(1);
  }

  const packageRaw: string = await readFile('./package.json', 'utf8');
  let json: { [key: string]: any } = {};

  try {

    json = JSON.parse(packageRaw);

  } catch (error) {

    Logger.danger("Invalid JSON in file: 'package.json'\n");
    process.exit(1);
  }

  const { argv } = process;
  const { dependencies } = json;
  if (!dependencies) {
    Logger.danger("Unable to read the dependencies.\n");
    process.exit(1);
  }

  const { 'react-native': nativeRaw, react: reactRaw } = dependencies;
  if (!nativeRaw || !reactRaw) {
    Logger.danger("Unable to find React Native.\n");
    process.exit(1);
  }

  const native: string = nativeRaw.replace('^', '')
    .replace('>=', '')
    .replace('<=', '')
    .replace('~', '')
    .replace('*', '');

  const react: string = reactRaw.replace('^', '')
    .replace('>=', '')
    .replace('<=', '')
    .replace('~', '')
    .replace('*', '');

  const hasReact: boolean = react.length > 2;
  const hasNative: boolean = native.length > 2;
  if (!hasReact || !hasNative) {
    Logger.danger("Unable to detect the React Native version.\n");
    process.exit(1);
  }

  Logger.warning(`Detected: React v${react}\n`);
  Logger.warning(`Detected: React Native v${native}\n`);

  for (let i = 0; argv.length > i; ++i) {

    if (argv[i] === 'setup') {
      if (isOS) {
        await Boot.setup(react, native);
      } else {
        Logger.danger("Use 'setup' outside of the Docker container.\n");
      }
      break;
    }

    if (argv[i] === 'build') {
      if (isOS) {
        Logger.danger("Use 'build' inside the Docker container.\n");
      } else {
        await Boot.build();
      }
      break;
    }

    if (argv[i] === 'watch') {
      if (isOS) {
        Logger.danger("Use 'watch' inside the Docker container.\n");
      } else {
        await Boot.watch();
      }
      break;
    }
  }

})();