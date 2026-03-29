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

import env from "core/env";
import Logger from "core/logger";
import path from "path";

import { Http1, Http1Ctx, Http1Stream } from "arnelify-server";
import { access, readFile } from "fs/promises";

import App from './App';
import manifest from "../app.json";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { AppRegistry } from "react-native";

/**
 * Production-server for development.
 */
(async function main(): Promise<void> {

  const http1: Http1 = new Http1({
    allow_empty_files: env.HTTP3_ALLOW_EMPTY_FILES === 'true',
    block_size_kb: Number(env.HTTP3_BLOCK_SIZE_KB),
    charset: env.HTTP3_CHARSET,
    compression: env.HTTP3_COMPRESSION === 'true',
    keep_alive: Number(env.HTTP3_KEEP_ALIVE),
    keep_extensions: env.HTTP3_KEEP_EXTENSIONS === 'true',
    max_fields: Number(env.HTTP3_MAX_FIELDS),
    max_fields_size_total_mb: Number(env.HTTP3_MAX_FIELDS_SIZE_TOTAL_MB),
    max_files: Number(env.HTTP3_MAX_FILES),
    max_files_size_total_mb: Number(env.HTTP3_MAX_FILES_SIZE_TOTAL_MB),
    max_file_size_mb: Number(env.HTTP3_MAX_FILE_SIZE_MB),
    port: Number(env.HTTP3_PORT),
    storage_path: env.HTTP3_STORAGE_PATH,
    thread_limit: Number(env.HTTP3_THREAD_LIMIT)
  });

  http1.logger(async (level: string, message: string): Promise<void> => {
    switch (level) {
      case 'success':
        Logger.success(`${message}\n`);
        break;
      case 'info':
        Logger.primary(`${message}\n`);
        break;
      case 'warning':
        Logger.warning(`${message}\n`);
        break;
      default:
        Logger.danger(`${message}\n`);
    }
  });

  http1.on('_', async (ctx: Http1Ctx, stream: Http1Stream): Promise<void> => {
    const { _state } = ctx;

    const web_path: string = path.resolve('web') + path.sep;
    const forbidden: string[] = [
      path.join(web_path, 'index.html'),
      path.join(web_path, 'server.js'),
      path.join(web_path, 'server'),
    ];

    const is_static: boolean = _state.path.indexOf('.') !== -1;
    if (is_static) {
      const file_path = path.resolve(path.join(web_path, _state.path));
      if (!forbidden.includes(file_path)
        && file_path.startsWith(web_path)) {

        try {
          await access(file_path);

        } catch (err) {
          await stream.set_code(404);
          await stream.push_json({
            code: 404,
            error: "Not found."
          });

          await stream.end();
          return;
        }

        await stream.set_code(200);
        await stream.push_file(file_path);
        await stream.end();
        return
      }

      await stream.set_code(404);
      await stream.push_json({ code: 404, error: 'Not found.' });
      await stream.end();
      return;
    }

    const { name } = manifest;
    AppRegistry.registerComponent(name, () => App); /* @ts-ignore */
    const { element, getStyleElement } = AppRegistry.getApplication(name, {
      initialProps: {} //some props...
    });

    const styles = renderToStaticMarkup(getStyleElement());
    const dom = renderToString(element);

    const buffer: Buffer = await readFile(path.resolve(path.join(web_path, 'index.html')));
    const html: string = buffer.toString()
      .replace('<div id="root"></div>', `<div id="root">${dom}</div>`)
      .replace('<!-- Dynamic-Styles -->', styles);

    await stream.set_code(200);
    await stream.add_header('Content-Type', 'text/html');
    await stream.push_bytes(Buffer.from(html));
    await stream.end();
  });

  await http1.start();

})();