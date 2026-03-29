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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Html_setup;
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
const plant_1 = __importDefault(require("../../plant"));
const logger_1 = __importDefault(require("../../logger"));
/**
 * Html
 */
class Html {
    /**
     * Construct
     * @returns
     */
    static construct() {
        return {
            name: 'html-plugin',
            setup: __classPrivateFieldGet(this, _a, "m", _Html_setup)
        };
    }
}
_a = Html, _Html_setup = function _Html_setup(build) {
    build.onEnd(async (result) => {
        const { initialOptions } = build;
        if (!initialOptions)
            return;
        const { metafile } = result;
        if (!metafile)
            return;
        const { outputs } = metafile;
        if (!outputs)
            return;
        const styles = [];
        const scripts = [];
        const { sourcemap } = initialOptions;
        if (sourcemap) {
            scripts.push(`<script src="/watch.js"></script>`);
        }
        for (const output in outputs) {
            const isStyle = output.endsWith('.css');
            if (isStyle) {
                const bundle = output.substring(3, output.length);
                styles.push(`<link href="${bundle}" rel="stylesheet" type="text/css">`);
                continue;
            }
            const isScript = output.endsWith('.js');
            if (isScript) {
                const bundle = output.substring(3, output.length);
                scripts.push(`<script src="${bundle}"></script>`);
                continue;
            }
        }
        const htmlPath = path_1.default.resolve('./src/public/index.html');
        const exists = await plant_1.default.exists(htmlPath);
        if (!exists)
            logger_1.default.danger(`Doesn't exist: ${htmlPath}\n`);
        const html = await (0, promises_1.readFile)(htmlPath, 'utf8');
        if (html) {
            const stylesSources = styles.length ? styles.join("\n  ") : '';
            const scriptsSources = scripts.length ? scripts.join("\n  ") : '';
            const sources = html
                .replace(/<!-- Styles -->/g, stylesSources)
                .replace(/<!-- Scripts -->/g, scriptsSources);
            await (0, promises_1.writeFile)(`./web/index.html`, sources);
        }
    });
};
exports.default = Html;
