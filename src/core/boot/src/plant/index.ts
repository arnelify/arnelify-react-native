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
import { access, copyFile, mkdir, readdir, rmdir, stat, unlink } from "fs/promises";
import { exec } from "child_process";

import Logger from "../logger";

/**
 * Plant
 */
class Plant {

  /**
   * Exists
   * @param {string} src 
   * @returns
   */
  static async exists(src: string): Promise<boolean> {
    try {
      await access(src);
      return true;

    } catch {
      return false;
    }
  }

  /**
   * Exec
   * @param {string} cmd
   * @returns 
   */
  static async exec(cmd: string, silent = true): Promise<any> {
    return new Promise((resolve: any): void => {
      exec(cmd, (error: any, stdout: string, stderr: string) => {
        if (stderr && !silent) console.log(stderr);
        if (error) {
          if (!silent) console.log(error);
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
  static async mkdir(dirPath: string): Promise<void> {
    await mkdir(dirPath, { recursive: true });
  }

  /**
   * Xrm
   * @param {string} path
   * @returns 
   */
  static async xrm(src: string): Promise<boolean> {
    const exists: boolean = await this.exists(src);
    if (!exists) return true;

    const srcStat: any = await stat(src);
    if (srcStat.isDirectory()) {
      const items: string[] = await readdir(src);
      for (const item of items) {
        const itemPath: string = path.join(src, item);
        await this.xrm(itemPath);
      }

      await rmdir(src);

    } else {
      await unlink(src);
    }

    return true;
  }

  /**
   * XCopy
   * @param {string} src 
   * @param {string} dest 
   */
  static async xcopy(src: string, dest: string, exclude: string[] = []) {
    for (const excluded of exclude) {
      if (dest.startsWith(excluded)) return;
    }

    const isExists: boolean = await this.exists(src);
    if (!isExists) {
      Logger.danger(`Doesn't exist: ${src}\n`);
      process.exit(1);
    }

    const srcStat: any = await stat(src);
    if (srcStat.isDirectory()) {
      await mkdir(dest, { recursive: true });
      const entries: string[] = await readdir(src);
      for (const entry of entries) {
        const srcFile: string = path.join(src, entry);
        const destFile: string = path.join(dest, entry);
        await Plant.xcopy(srcFile, destFile, exclude);
      }
    } else {
      await copyFile(src, dest);
    }
  }
}

export default Plant;