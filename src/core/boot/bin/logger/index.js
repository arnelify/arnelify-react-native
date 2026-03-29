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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Logger
 */
class Logger {
    /**
     * Primary
     * @param {string} message
     * @param {number} replace
     */
    static primary(message, replace = 0) {
        const before = (replace ? "\r" : "") + "\x1b[0m";
        const after = "\x1b[0m";
        if (replace)
            process.stdout.write("\r".padEnd(replace, ' '));
        process.stdout.write(`${before}[Arnelify React Native]: ${message}${after}`);
    }
    /**
     * Success
     * @param {string} message
     * @param {number} replace
     */
    static success(message, replace = 0) {
        const before = (replace ? "\r" : "") + "\x1b[32m";
        const after = "\x1b[0m";
        if (replace)
            process.stdout.write("\r".padEnd(replace, ' '));
        process.stdout.write(`${before}[Arnelify React Native]: ${message}${after}`);
    }
    /**
     * Warning
     * @param {string} message
     * @param {number} replace
     */
    static warning(message, replace = 0) {
        const before = (replace ? "\r" : "") + "\x1b[33m";
        const after = "\x1b[0m";
        if (replace)
            process.stdout.write("\r".padEnd(replace, ' '));
        process.stdout.write(`${before}[Arnelify React Native]: ${message}${after}`);
    }
    /**
     * Danger
     * @param {string} message
     * @param {number} replace
     */
    static danger(message, replace = 0) {
        const before = (replace ? "\r" : "") + "\x1b[31m";
        const after = "\x1b[0m";
        if (replace)
            process.stdout.write("\r".padEnd(replace, ' '));
        process.stdout.write(`${before}[Arnelify React Native]: ${message}${after}`);
    }
}
exports.default = Logger;
