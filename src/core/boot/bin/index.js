#!/usr/bin/env node
"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
const plant_1 = __importDefault(require("./plant"));
const logger_1 = __importDefault(require("./logger"));
const watcher_1 = __importDefault(require("./watcher"));
/**
 * Boot
 */
class Boot {
    /**
     * Setup
     */
    static async setup(react, native) {
        const lib_path = path_1.default.resolve(path_1.default.join(__dirname, '../../../../'));
        const root_path = path_1.default.resolve('.');
        await plant_1.default.exec('npm pkg delete scripts.ios');
        await plant_1.default.exec('npm pkg delete scripts.android');
        await plant_1.default.exec('npm pkg delete scripts.start');
        await plant_1.default.exec('npm pkg delete scripts.test');
        logger_1.default.warning("Removing unnecessary packages: 'prettier'...");
        await plant_1.default.exec('npm uninstall prettier');
        await plant_1.default.xrm(path_1.default.resolve(path_1.default.join(root_path, '.prettierrc.js')));
        logger_1.default.warning("Removing unnecessary packages: 'eslint'...", 128);
        await plant_1.default.xrm(path_1.default.resolve(path_1.default.join(root_path, '.eslintrc.js')));
        await plant_1.default.exec('npm uninstall @react-native/eslint-config');
        await plant_1.default.exec('npm pkg delete scripts.lint');
        await plant_1.default.exec('npm uninstall eslint');
        logger_1.default.warning("Removing unnecessary packages...\n", 128);
        logger_1.default.warning(`Installing framework...\n`);
        await plant_1.default.xrm(path_1.default.resolve(path_1.default.join(root_path, 'App.tsx')));
        await plant_1.default.xrm(path_1.default.resolve(path_1.default.join(root_path, 'package-lock.json')));
        await plant_1.default.mkdir(path_1.default.resolve(path_1.default.join(root_path, 'src/app/locales')));
        await plant_1.default.mkdir(path_1.default.resolve(path_1.default.join(root_path, 'src/app/layouts')));
        await plant_1.default.mkdir(path_1.default.resolve(path_1.default.join(root_path, 'src/app/middleware')));
        await plant_1.default.mkdir(path_1.default.resolve(path_1.default.join(root_path, 'src/app/pages')));
        await plant_1.default.mkdir(path_1.default.resolve(path_1.default.join(root_path, 'src/tests')));
        const exclude = [
            path_1.default.resolve(path_1.default.join(root_path, '.git')),
            path_1.default.resolve(path_1.default.join(root_path, 'node_modules')),
            path_1.default.resolve(path_1.default.join(root_path, 'src/core')),
            path_1.default.resolve(path_1.default.join(root_path, 'LICENSE')),
            path_1.default.resolve(path_1.default.join(root_path, 'package.json')),
            path_1.default.resolve(path_1.default.join(root_path, 'README.md')),
            path_1.default.resolve(path_1.default.join(root_path, 'yarn.lock'))
        ];
        await plant_1.default.xcopy(lib_path, root_path, exclude);
        const root_git_path = path_1.default.resolve(path_1.default.join(root_path, '.gitignore'));
        const lib_git_path = path_1.default.resolve(path_1.default.join(lib_path, '.gitignore'));
        await plant_1.default.xcopy(lib_git_path, root_git_path);
        await plant_1.default.mkdir(path_1.default.resolve(path_1.default.join(root_path, 'src/core/env')));
        const lib_boot_path = path_1.default.resolve(path_1.default.join(lib_path, 'src/core/boot/bin'));
        const root_boot_path = path_1.default.resolve(path_1.default.join(root_path, 'src/core/boot/bin'));
        await plant_1.default.xcopy(lib_boot_path, root_boot_path);
        const lib_logger_path = path_1.default.resolve(path_1.default.join(lib_path, 'src/core/logger'));
        const root_logger_path = path_1.default.resolve(path_1.default.join(root_path, 'src/core/logger'));
        await plant_1.default.xcopy(lib_logger_path, root_logger_path);
        let build_script = 'clear ';
        build_script += '&& bun ./src/core/boot/bin/index.js build ';
        build_script += '&& pkg ./web/server.js --targets node18-linux-arm64 --output ./web/server ';
        build_script += '&& rm ./web/server.js';
        await plant_1.default.exec(`npm pkg set scripts.build="${build_script}"`);
        let watch_script = 'clear ';
        watch_script += '&& bun ./src/core/boot/bin/index.js watch';
        await plant_1.default.exec(`npm pkg set scripts.watch="${watch_script}"`);
        let native_script = 'clear ';
        native_script += '&& react-native start';
        await plant_1.default.exec(`npm pkg set scripts.native="${native_script}"`);
        let jest_script = 'clear ';
        jest_script += '&& jest';
        await plant_1.default.exec(`npm pkg set scripts.test="${jest_script}"`);
        logger_1.default.warning(`Installing packages: 'react-dom@${react}'...`);
        await plant_1.default.exec(`npm install react-dom@${react} --save-exact`);
        await plant_1.default.exec(`npm install -D @types/react-dom@${react}`);
        logger_1.default.warning("Installing packages...\n", 128);
        logger_1.default.success("Successfully!\n");
    }
    /**
     * Build
     */
    static async build() {
        const env_path = path_1.default.resolve('./.env');
        const watch_path = path_1.default.resolve('./src/server.tsx');
        const server_path = path_1.default.resolve('./web/server');
        const watcher = new watcher_1.default();
        await watcher.apply(env_path);
        await watcher.build(watch_path, server_path);
    }
    /**
     * Watch
     */
    static async watch() {
        const env_path = path_1.default.resolve('./.env');
        const watch_path = path_1.default.resolve('./src/watch.tsx');
        const server_path = path_1.default.resolve("./web/server");
        const watcher = new watcher_1.default();
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
(async function main() {
    const vendor_path = path_1.default.resolve('./vendor');
    const isOS = await plant_1.default.exists(vendor_path);
    const packagePath = path_1.default.resolve('./package.json');
    const exists = await plant_1.default.exists(packagePath);
    if (!exists) {
        logger_1.default.danger("Use 'setup' in root folder of React Native project.\n");
        process.exit(1);
    }
    const packageRaw = await (0, promises_1.readFile)('./package.json', 'utf8');
    let json = {};
    try {
        json = JSON.parse(packageRaw);
    }
    catch (error) {
        logger_1.default.danger("Invalid JSON in file: 'package.json'\n");
        process.exit(1);
    }
    const { argv } = process;
    const { dependencies } = json;
    if (!dependencies) {
        logger_1.default.danger("Unable to read the dependencies.\n");
        process.exit(1);
    }
    const { 'react-native': nativeRaw, react: reactRaw } = dependencies;
    if (!nativeRaw || !reactRaw) {
        logger_1.default.danger("Unable to find React Native.\n");
        process.exit(1);
    }
    const native = nativeRaw.replace('^', '')
        .replace('>=', '')
        .replace('<=', '')
        .replace('~', '')
        .replace('*', '');
    const react = reactRaw.replace('^', '')
        .replace('>=', '')
        .replace('<=', '')
        .replace('~', '')
        .replace('*', '');
    const hasReact = react.length > 2;
    const hasNative = native.length > 2;
    if (!hasReact || !hasNative) {
        logger_1.default.danger("Unable to detect the React Native version.\n");
        process.exit(1);
    }
    logger_1.default.warning(`Detected: React v${react}\n`);
    logger_1.default.warning(`Detected: React Native v${native}\n`);
    for (let i = 0; argv.length > i; ++i) {
        if (argv[i] === 'setup') {
            if (isOS) {
                await Boot.setup(react, native);
            }
            else {
                logger_1.default.danger("Use 'setup' outside of the Docker container.\n");
            }
            break;
        }
        if (argv[i] === 'build') {
            if (isOS) {
                logger_1.default.danger("Use 'build' inside the Docker container.\n");
            }
            else {
                await Boot.build();
            }
            break;
        }
        if (argv[i] === 'watch') {
            if (isOS) {
                logger_1.default.danger("Use 'watch' inside the Docker container.\n");
            }
            else {
                await Boot.watch();
            }
            break;
        }
    }
})();
