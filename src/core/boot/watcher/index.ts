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
import { spawn } from "child_process";

import Env from "./env";
import ESBuild from "./esbuild";
import Html from "./html";
import Native from "./native";

import Logger from "core/logger";
import Plant from "../plant";

/**
 * Watcher
 */
class Watcher {

  pid: number = -1;

  /**
   * Apply
   * @param {string} envPath 
   */
  async apply(envPath: string): Promise<void> {
    const savePath: string = path.resolve('./src/core/env/index.ts');
    const raw: string = await Env.read(envPath);
    const data: { [key: string]: any } = Env.parse(raw);
    const sources: string = Env.sources(data);
    await Env.save(savePath, sources);
  }

  /**
   * Build
   * @param {string} watchPath 
   * @param {string} serverPath 
   */
  async build(watchPath: string, serverPath: string): Promise<void> {
    const isWatch: boolean = watchPath.endsWith('watch.tsx');
    const buildPath: string = path.dirname(serverPath);
    const srcPath: string = path.dirname(watchPath);

    await Plant.exec(`rm -rf ${buildPath}/*`);
    await Plant.xcopy(path.join(srcPath, 'public'), buildPath, (src: string): boolean => {
      const exclude = [
        path.join(srcPath, 'index.html')
      ];

      const isExcluded = exclude.includes(src);
      if (isExcluded) return false;
      return true;
    });

    if (!isWatch) {
      const server = new ESBuild();
      server.addEntryPoint(watchPath);
      server.setEntryNames('server');
      server.setFormat(isWatch ? 'iife' : 'cjs');
      server.setMinify(!isWatch);
      server.setOutDir(buildPath);
      server.setPlatform('node');
      server.addPlugin(Native.construct());
      server.setSourceMap(isWatch);
      await server.build();
    }

    const client = new ESBuild();
    client.addEntryPoint('./index.js');
    client.setFormat(isWatch ? 'iife' : 'cjs');
    client.setMinify(!isWatch);
    client.setOutDir(buildPath);
    client.setPlatform('browser');
    client.addPlugin(Html.construct());
    client.setSourceMap(isWatch);
    await client.build();

    if (!isWatch) {
      const rootPath: string = process.cwd();
      Logger.warning(`Compiling from sources '${watchPath.replace(rootPath, ".")}'\n`);
    }
  }

  /**
   * Start
   * @param {string} watcherPath 
   */
  start(watcherPath: string): void {
    const { pid } = spawn('bun', [watcherPath], { stdio: 'inherit' });
    if (!pid) {
      Logger.danger("Can't create child process.\n");
      process.exit();
    }

    this.pid = pid;
  }

  /**
   * Close
   */
  close(): void {
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
  async watch(watchPath: string, serverPath: string): Promise<void> {
    const srcPath: string = path.dirname(watchPath);
    const thread: any = spawn('inotifywait', [
      '-m', '-q', '-r', '-e', 'modify', '--exclude',
      './src/storage', srcPath
    ]);

    thread.stdout.on('data', async (): Promise<void> => {
      this.close();
      await this.build(watchPath, serverPath);
      this.start(watchPath);
    });

    thread.on('error', (): void => {
      Logger.danger("Can't start watcher.\n");
    });
  }
}

export default Watcher;