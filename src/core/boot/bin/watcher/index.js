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
const child_process_1 = require("child_process");
const env_1 = __importDefault(require("./env"));
const esbuild_1 = __importDefault(require("./esbuild"));
const html_1 = __importDefault(require("./html"));
const native_1 = __importDefault(require("./native"));
const logger_1 = __importDefault(require("../logger"));
const plant_1 = __importDefault(require("../plant"));
/**
 * Watcher
 */
class Watcher {
    constructor() {
        this.pid = -1;
    }
    /**
     * Apply
     * @param {string} envPath
     */
    async apply(envPath) {
        const savePath = path_1.default.resolve('./src/core/env/index.ts');
        const raw = await env_1.default.read(envPath);
        const data = env_1.default.parse(raw);
        const sources = env_1.default.sources(data);
        await env_1.default.save(savePath, sources);
    }
    /**
     * Build
     * @param {string} watchPath
     * @param {string} serverPath
     */
    async build(watchPath, serverPath) {
        const isWatch = watchPath.endsWith('watch.tsx');
        const buildPath = path_1.default.dirname(serverPath);
        const srcPath = path_1.default.dirname(watchPath);
        const exclude = [
            path_1.default.join(srcPath, 'index.html')
        ];
        await plant_1.default.exec(`rm -rf ${buildPath}/*`);
        await plant_1.default.xcopy(path_1.default.join(srcPath, 'public'), buildPath, exclude);
        if (!isWatch) {
            const server = new esbuild_1.default();
            server.addEntryPoint(watchPath);
            server.setEntryNames('server');
            server.setFormat(isWatch ? 'iife' : 'cjs');
            server.setMinify(!isWatch);
            server.setOutDir(buildPath);
            server.setPlatform('node');
            server.addPlugin(native_1.default.construct());
            server.setSourceMap(isWatch);
            await server.build();
        }
        const client = new esbuild_1.default();
        client.addEntryPoint('./index.js');
        client.setFormat(isWatch ? 'iife' : 'cjs');
        client.setMinify(!isWatch);
        client.setOutDir(buildPath);
        client.setPlatform('browser');
        client.addPlugin(html_1.default.construct());
        client.setSourceMap(isWatch);
        await client.build();
        if (!isWatch) {
            const rootPath = process.cwd();
            logger_1.default.warning(`Compiling from sources '${watchPath.replace(rootPath, ".")}'\n`);
        }
    }
    /**
     * Start
     * @param {string} watcherPath
     */
    start(watcherPath) {
        const { pid } = (0, child_process_1.spawn)('bun', [watcherPath], { stdio: 'inherit' });
        if (!pid) {
            logger_1.default.danger("Can't create child process.\n");
            process.exit();
        }
        this.pid = pid;
    }
    /**
     * Close
     */
    close() {
        if (this.pid > 0) {
            process.kill(this.pid, 'SIGTERM');
            this.pid = -1;
        }
    }
    /**
     * Watch
     * @param {string} watchPath
     * @param {string} serverPath
     */
    async watch(watchPath, serverPath) {
        const srcPath = path_1.default.dirname(watchPath);
        const thread = (0, child_process_1.spawn)('inotifywait', [
            '-m', '-q', '-r', '-e', 'modify', '--exclude',
            './src/storage', srcPath
        ]);
        thread.stdout.on('data', async () => {
            this.close();
            await this.build(watchPath, serverPath);
            this.start(watchPath);
        });
        thread.on('error', () => {
            logger_1.default.danger("Can't start watcher.\n");
        });
    }
}
exports.default = Watcher;
