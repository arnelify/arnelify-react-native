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
 * Env
 */
class Env {

  /**
   * Read
   * @param {string} envPath
   * @returns 
   */
  static async read(envPath: string): Promise<string> {
    try {
      return readFile(envPath, 'utf-8');

    } catch (error) {
      Logger.danger(`Error opening file: ${envPath}\n`);
      process.exit(1);
    }
  }

  /**
   * Parse
   * @param {string} raw 
   * @param {object} data 
   * @returns 
   */
  static parse(raw: string, data: {[key: string]: any} = {}): {[key: string]: any} {
    const lines: string[] = raw.split('\n');
    for (let i = 0; lines.length > i; i++) {
      const line: string = lines[i].trim();
      const isEmpty: boolean = !line || line.startsWith('#');
      if (isEmpty) continue;

      const [key, value] = line.split('=').map((part: string) => part.trim());
      if (key && value) data[key] = value;
    }

    return data;
  }

  /**
   * Sources
   * @param {object} data 
   * @returns 
   */
  static sources(data: {[key: string]: any}): string {
    
    let output: string = `/**\n`;

    output += ` * Env\n`;
    output += ` */\n`;
    output += `class Env {\n\n`;

    for (const key in data) {
      output += `  ${key} = "${data[key]}";\n`;
    }

    output += `\n}\n\n`;
    output += `const env = new Env();\n\n`;
    output += `export default env;`
    
    return output;
  }

  /**
   * Save
   * @param {string} envPath 
   * @param {string} sources 
   */
  static async save(envPath: string, sources: string) {
    const outDir: string = path.dirname(envPath);
    await Plant.mkdir(outDir);

    try {
      await writeFile(envPath, sources);

    } catch (error) {
      Logger.danger(`Error saving file: ${envPath}\n`);
      process.exit(1);
    }
  }
}

export default Env;