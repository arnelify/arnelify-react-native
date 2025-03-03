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

/** @ts-ignore */
import ArnelifyServer from "arnelify-server";
import env from "core/env";
import Logger from "core/logger";
import { access } from "fs/promises";
import path from "path";

/** for hot module replacement
 * @ts-ignore */
import WebSocket from "ws";

/**
 * Watch-server for development.
 */
class Watch {

  #router: any = null;
  #server: any = null;

  constructor() {
    this.#router = null;
    this.#server = new ArnelifyServer({
      "SERVER_ALLOW_EMPTY_FILES": env.SERVER_ALLOW_EMPTY_FILES === "true",
      "SERVER_BLOCK_SIZE_KB": Number(env.SERVER_BLOCK_SIZE_KB),
      "SERVER_CHARSET": env.SERVER_CHARSET,
      "SERVER_GZIP": env.SERVER_GZIP === "true",
      "SERVER_KEEP_EXTENSIONS": env.SERVER_KEEP_EXTENSIONS === "true",
      "SERVER_MAX_FIELDS": Number(env.SERVER_MAX_FIELDS),
      "SERVER_MAX_FIELDS_SIZE_TOTAL_MB": Number(env.SERVER_MAX_FIELDS_SIZE_TOTAL_MB),
      "SERVER_MAX_FILES": Number(env.SERVER_MAX_FILES),
      "SERVER_MAX_FILES_SIZE_TOTAL_MB": Number(env.SERVER_MAX_FILES_SIZE_TOTAL_MB),
      "SERVER_MAX_FILE_SIZE_MB": Number(env.SERVER_MAX_FILE_SIZE_MB),
      "SERVER_PORT": Number(env.SERVER_PORT),
      "SERVER_QUEUE_LIMIT": Number(env.SERVER_QUEUE_LIMIT),
      "SERVER_UPLOAD_DIR": "./src/public"
    });

    this.#server.setHandler(this.#handler);
  }

  /**
   * Handler
   * @param {any} req 
   * @param {any} res 
   * @returns 
   */
  async #handler(req: any, res: any): Promise<void> {
    const { _state } = req;

    const forbidden: string[] = ['/server', '/server.js'];
    const isForbidden: boolean = forbidden.includes(_state.path);
    if (isForbidden) {
      res.setCode(404);
      res.addBody(JSON.stringify({
        code: 404,
        error: "Not found."
      }));
      res.end();
      return;
    }

    const isStatic: boolean = _state.path !== "/";
    if (isStatic) {
      const filePath: string = path.resolve(`web/${_state.path}`);
      try {
        await access(filePath);

      } catch (err) {
        res.setCode(404);
        res.addBody(JSON.stringify({
          code: 404,
          error: "Not found."
        }));

        res.end();
        return;
      }

      res.setCode(200);
      res.setFile(filePath, true);
      res.end();
      return;
    }

    const filePath: string = path.resolve(`web/index.html`);
    res.setCode(200);
    res.setFile(filePath, true);
    res.end();
  }

  /**
   * Start
   */
  start(): void {
    this.#server.start((message: string, isError: boolean): void => {
      if (isError) {
        Logger.danger(`Error: ${message}\n`);
        return;
      }

      Logger.success(`${message}\n`);
    });

    const version = Date.now();
    const wss = new WebSocket.Server({ port: 8433 });
    wss.on('connection', (ws: any) => {
      ws.send(JSON.stringify({ version }));
    });
  }

  /**
   * Stop
   */
  stop(): void {
    this.#server.stop();
    Logger.success("Server stopped\n");
  }
}

/**
 * Main
 */
(function main(): number {

  const watch: Watch = new Watch();
  watch.start();

  return 0;

})();