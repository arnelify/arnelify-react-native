#!/usr/bin/env bun

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
import Logger from "core/logger";
import Watcher from "./watcher";

/**
 * Boot
 */
class Boot {

  /**
   * Setup
   */
  static async setup(react: string, native: string): Promise<void> {

    await Plant.exec('npm pkg delete scripts.ios');
    await Plant.exec('npm pkg delete scripts.android');
    await Plant.exec('npm pkg delete scripts.start');
    await Plant.exec('npm pkg delete scripts.test');

    Logger.warning("Removing unnecessary packages: 'prettier'...");
    await Plant.exec('npm uninstall prettier');
    await Plant.xrm(path.resolve('./.prettierrc.js'));

    Logger.warning("Removing unnecessary packages: 'eslint'...", 128);
    await Plant.exec('npm uninstall eslint');
    await Plant.exec('npm uninstall @react-native/eslint-config');
    await Plant.exec('npm pkg delete scripts.lint');
    await Plant.xrm(path.resolve('./.eslintrc.js'));

    Logger.warning("Removing unnecessary packages...\n", 128);
    Logger.warning(`Installing framework...\n`);

    const projectPath: string = path.resolve('./');
    const packagePath: string = path.resolve(__dirname, '../../../');

    await Plant.xrm(path.resolve('./App.tsx'));
    await Plant.xrm(path.resolve('./package-lock.json'));
    await Plant.mkdir(path.resolve('./src/app/layouts'));
    await Plant.mkdir(path.resolve('./src/app/middleware'));
    await Plant.mkdir(path.resolve('./src/app/pages'));
    await Plant.mkdir(path.resolve('./src/app/translations'));
    await Plant.mkdir(path.resolve('./src/tests'));

    await Plant.xcopy(packagePath, projectPath, (src: string): boolean => {
      const exclude = [
        path.resolve('.', '.git'),
        path.resolve('.', 'node_modules'),
        path.resolve('.', 'LICENSE'),
        path.resolve('.', 'package.json'),
        path.resolve('.', 'README.md'),
        path.resolve('.', 'yarn.lock')
      ];

      const isExcluded = exclude.includes(src);
      if (isExcluded) return false;
      return true;
    });

    await Plant.exec(`npm pkg set scripts.build="clear && ./src/core/boot/index.ts build && pkg ./web/server.js --targets node18-linux-arm64 --output ./web/server && rm ./web/server.js"`);
    await Plant.exec(`npm pkg set scripts.watch="clear && ./src/core/boot/index.ts watch"`);
    await Plant.exec(`npm pkg set scripts.native="clear && react-native start"`);
    await Plant.exec(`npm pkg set scripts.test="clear && jest"`);

    Logger.warning(`Installing packages: 'react-dom@${react}'...`);
    await Plant.exec(`yarn add react-dom@${react}`);
    await Plant.exec(`yarn add -D @types/react-dom@${react}`);

    Logger.warning("Installing packages...\n", 128);
    Logger.success("Successfully!\n");
  }

  /**
   * Build
   */
  static async build(): Promise<void> {
    const envPath: string = path.resolve('./.env');
    const watchPath: string = path.resolve('./src/server.tsx');
    const serverPath: string = path.resolve('./web/server');

    const watcher: Watcher = new Watcher();
    await watcher.apply(envPath);
    await watcher.build(watchPath, serverPath);
  }

  /**
   * Watch
   */
  static async watch(): Promise<void> {
    const envPath: string = path.resolve('./.env');
    const watchPath: string = path.resolve('./src/watch.tsx');
    const serverPath: string = path.resolve("./web/server");

    const watcher: Watcher = new Watcher();
    await watcher.apply(envPath);
    await watcher.build(watchPath, serverPath);
    watcher.start(watchPath);
    await watcher.watch(watchPath, serverPath);
  }
}

/**
 * Main
 * @returns
 */
(async function main(): Promise<number> {

  const dockerPath: string = path.resolve('./vendor');
  const isOS: boolean = await Plant.exists(dockerPath);

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

    const isSetup: boolean = argv[i] === 'setup';
    if (isSetup) {
      if (isOS) {
        await Boot.setup(react, native);
      } else {
        Logger.danger("Use 'setup' outside of the Docker container.\n");
      }
      break;
    }

    const isBuild: boolean = argv[i] === 'build';
    if (isBuild) {
      if (isOS) {
        Logger.danger("Use 'build' inside the Docker container.\n");
      } else {
        await Boot.build();
      }
      break;
    }

    const isWatch: boolean = argv[i] === 'watch';
    if (isWatch) {
      if (isOS) {
        Logger.danger("Use 'watch' inside the Docker container.\n");
      } else {
        await Boot.watch();
      }
      break;
    }
  }

  return 0;

})();