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
/** @ts-ignore */
const esbuild_1 = __importDefault(require("esbuild"));
/**
 * ESBuild
 */
class ESBuild {
    constructor() {
        this.opts = {
            alias: {
                'arnelify-react-native': 'react-native-web',
                'react-native': 'react-native-web'
            },
            allowOverwrite: true,
            bundle: true,
            entryPoints: [],
            entryNames: "[dir]/[hash]",
            format: 'cjs',
            loader: {
                ".ico": "file",
                ".svg": "file",
                ".woff2": "file",
                ".woff": "file",
                ".ttf": "file",
                ".eot": "file",
                ".otf": "file",
                ".mp4": "file",
                ".avi": "file",
                ".mkv": "file",
                ".mov": "file",
                ".jpeg": "file",
                ".jpg": "file",
                ".png": "file",
                ".webp": "file",
                ".gif": "file",
                ".weba": "file",
                ".mp3": "file",
                ".wav": "file",
                ".csv": "file"
            },
            metafile: true,
            minify: false,
            outdir: './',
            platform: 'node',
            plugins: [],
            sourcemap: false,
            tsconfig: './tsconfig.json'
        };
    }
    /**
     * Add EntryPoint
     * @param {string} value
     */
    addEntryPoint(value) {
        this.opts.entryPoints.push(value);
    }
    /**
     * Set EntryNames
     * @param {string} value
     */
    setEntryNames(value) {
        this.opts.entryNames = `[dir]/${value}`;
    }
    /**
     * Set Format
     * @param {string} value
     */
    setFormat(value) {
        this.opts.format = value;
    }
    /**
     * Set Minify
     * @param {boolean} value
     */
    setMinify(value) {
        this.opts.minify = value;
    }
    /**
     * Set OutDir
     * @param {string} value
     */
    setOutDir(value) {
        this.opts.outdir = value;
    }
    /**
     * Set Platform
     * @param {string} value
     */
    setPlatform(value) {
        this.opts.platform = value;
        if (value === 'node') {
            this.opts.packages = "external";
            this.opts.external = ["node_modules"];
        }
    }
    /**
    * Add Plugin
    * @param {object} value
    */
    addPlugin(value) {
        this.opts.plugins.push(value);
    }
    /**
     * Set SourceMap
     * @param {boolean} value
     */
    setSourceMap(value) {
        this.opts.sourcemap = value;
    }
    /**
     * Build
     */
    async build() {
        await esbuild_1.default.build(this.opts);
    }
}
exports.default = ESBuild;
