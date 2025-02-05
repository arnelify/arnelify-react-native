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

import Logger from "core/logger";

/**
 * Plant
 */
class Plant {

  /**
   * Exists
   * @param {string} srcPath 
   * @returns
   */
  static async exists(srcPath: string): Promise<boolean> {
    try {
      await access(srcPath);
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
  static async xrm(srcPath: string): Promise<boolean> {
    const exists: boolean = await this.exists(srcPath);
    if (!exists) return true;

    const srcStat: any = await stat(srcPath);
    if (srcStat.isDirectory()) {
      const items: string[] = await readdir(srcPath);
      for (const item of items) {
        const itemPath: string = path.join(srcPath, item);
        await this.xrm(itemPath);
      }

      await rmdir(srcPath);

    } else {
      await unlink(srcPath);
    }

    return true;
  }

  /**
   * XCopy
   * @param {string} srcPath 
   * @param {string} destPath 
   */
  static async xcopy(srcPath: string, destPath: string, callback: CallableFunction | null = null) {
    const isExists: boolean = await this.exists(srcPath);
    if (!isExists) {
      Logger.danger(`Doesn't exist: ${srcPath}\n`);
      process.exit(1);
    }

    const srcStat: any = await stat(srcPath);
    if (srcStat.isDirectory()) {
      await mkdir(destPath, { recursive: true });
      const entries: string[] = await readdir(srcPath);
      for (const entry of entries) {
        const srcFile: string = path.join(srcPath, entry);
        const destFile: string = path.join(destPath, entry);
        if (callback) {
          const hasPass: boolean = callback(destFile);
          if (hasPass) await Plant.xcopy(srcFile, destFile);

        } else {
          await Plant.xcopy(srcFile, destFile);
        }
      }

    } else {
      if (callback) {
        const hasPass: boolean = callback(destPath);
        if (hasPass) await Plant.xcopy(srcPath, destPath);

      } else {
        await copyFile(srcPath, destPath);
      }
    }
  }
}

export default Plant;