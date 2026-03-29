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
const plant_1 = __importDefault(require("../../plant"));
const logger_1 = __importDefault(require("../../logger"));
/**
 * Env
 */
class Env {
    /**
     * Read
     * @param {string} envPath
     * @returns
     */
    static async read(envPath) {
        try {
            return (0, promises_1.readFile)(envPath, 'utf-8');
        }
        catch (error) {
            logger_1.default.danger(`Error opening file: ${envPath}\n`);
            process.exit(1);
        }
    }
    /**
     * Parse
     * @param {string} raw
     * @param {object} data
     * @returns
     */
    static parse(raw, data = {}) {
        const lines = raw.split('\n');
        for (let i = 0; lines.length > i; i++) {
            const line = lines[i].trim();
            const isEmpty = !line || line.startsWith('#');
            if (isEmpty)
                continue;
            const [key, value] = line.split('=').map((part) => part.trim());
            if (key && value)
                data[key] = value;
        }
        return data;
    }
    /**
     * Sources
     * @param {object} data
     * @returns
     */
    static sources(data) {
        let output = `/**\n`;
        output += ` * Env\n`;
        output += ` */\n`;
        output += `class Env {\n\n`;
        for (const key in data) {
            output += `  ${key} = "${data[key]}";\n`;
        }
        output += `\n}\n\n`;
        output += `const env = new Env();\n\n`;
        output += `export default env;`;
        return output;
    }
    /**
     * Save
     * @param {string} envPath
     * @param {string} sources
     */
    static async save(envPath, sources) {
        const outDir = path_1.default.dirname(envPath);
        await plant_1.default.mkdir(outDir);
        try {
            await (0, promises_1.writeFile)(envPath, sources);
        }
        catch (error) {
            logger_1.default.danger(`Error saving file: ${envPath}\n`);
            process.exit(1);
        }
    }
}
exports.default = Env;
