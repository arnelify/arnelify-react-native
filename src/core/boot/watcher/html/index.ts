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
import { readFile, writeFile } from "fs/promises";

import Plant from "../../plant";
import Logger from "core/logger";

/**
 * Html
 */
class Html {

  /**
   * Setup
   * @param {object} build 
   */
  static #setup(build: {[key: string]: any}): void {

    build.onEnd(async (result: {[key: string]: any}): Promise<void> => {
      const { initialOptions } = build;
      if (!initialOptions) return;

      const { metafile } = result;
      if (!metafile) return;

      const { outputs } = metafile;
      if (!outputs) return;

      const styles: string[] = [];
      const scripts: string[] = [];
      const { sourcemap } = initialOptions;
      if (sourcemap) {
        scripts.push(`<script src="/watch.js"></script>`);
      }

      for (const output in outputs) {
        const isStyle: boolean = output.endsWith('.css');
        if (isStyle) {
          const bundle: string = output.substring(3, output.length);
          styles.push(`<link href="${bundle}" rel="stylesheet" type="text/css">`);
          continue;
        }

        const isScript: boolean = output.endsWith('.js');
        if (isScript) {
          const bundle: string = output.substring(3, output.length);
          scripts.push(`<script src="${bundle}"></script>`);
          continue;
        }
      }

      const htmlPath: string = path.resolve('./src/public/index.html');
      const exists: boolean = await Plant.exists(htmlPath);
      if (!exists) Logger.danger(`Doesn't exist: ${htmlPath}\n`);

      const html: string = await readFile(htmlPath, 'utf8');
      if (html) {

        const stylesSources: string = styles.length ? styles.join("\n  ") : '';
        const scriptsSources: string = scripts.length ? scripts.join("\n  ") : '';
        const sources: string = html
          .replace(/<!-- Styles -->/g, stylesSources)
          .replace(/<!-- Scripts -->/g, scriptsSources);

        await writeFile(`./web/index.html`, sources);
      }

    });
  }

  /**
   * Construct
   * @returns 
   */
  static construct(): {[key: string]: any} {
    return {
      name: 'html-plugin',
      setup: this.#setup
    };
  }
}

export default Html;