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
const child_process_1 = require("child_process");
const logger_1 = __importDefault(require("../logger"));
/**
 * Plant
 */
class Plant {
    /**
     * Exists
     * @param {string} src
     * @returns
     */
    static async exists(src) {
        try {
            await (0, promises_1.access)(src);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Exec
     * @param {string} cmd
     * @returns
     */
    static async exec(cmd, silent = true) {
        return new Promise((resolve) => {
            (0, child_process_1.exec)(cmd, (error, stdout, stderr) => {
                if (stderr && !silent)
                    console.log(stderr);
                if (error) {
                    if (!silent)
                        console.log(error);
                    resolve(error);
                }
                resolve(stdout);
            });
        });
    }
    /**
     * MkDir
     * @param {string} dirPath
     */
    static async mkdir(dirPath) {
        await (0, promises_1.mkdir)(dirPath, { recursive: true });
    }
    /**
     * Xrm
     * @param {string} path
     * @returns
     */
    static async xrm(src) {
        const exists = await this.exists(src);
        if (!exists)
            return true;
        const srcStat = await (0, promises_1.stat)(src);
        if (srcStat.isDirectory()) {
            const items = await (0, promises_1.readdir)(src);
            for (const item of items) {
                const itemPath = path_1.default.join(src, item);
                await this.xrm(itemPath);
            }
            await (0, promises_1.rmdir)(src);
        }
        else {
            await (0, promises_1.unlink)(src);
        }
        return true;
    }
    /**
     * XCopy
     * @param {string} src
     * @param {string} dest
     */
    static async xcopy(src, dest, exclude = []) {
        for (const excluded of exclude) {
            if (dest.startsWith(excluded))
                return;
        }
        const isExists = await this.exists(src);
        if (!isExists) {
            logger_1.default.danger(`Doesn't exist: ${src}\n`);
            process.exit(1);
        }
        const srcStat = await (0, promises_1.stat)(src);
        if (srcStat.isDirectory()) {
            await (0, promises_1.mkdir)(dest, { recursive: true });
            const entries = await (0, promises_1.readdir)(src);
            for (const entry of entries) {
                const srcFile = path_1.default.join(src, entry);
                const destFile = path_1.default.join(dest, entry);
                await Plant.xcopy(srcFile, destFile, exclude);
            }
        }
        else {
            await (0, promises_1.copyFile)(src, dest);
        }
    }
}
exports.default = Plant;
