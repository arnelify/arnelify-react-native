const path = require("path");
const { readFile } = require("fs/promises");
const print = require("./print");
const exec = require("./exec");

class Plant {

  static async #detectYarn() {
    return await exec('yarn -v', true);
  }

  static async #getPackages() {

    const rootDir = path.resolve(".");

    try {

      const packageJsonPath = path.resolve(rootDir, "package.json");
      const packageJson = await readFile(packageJsonPath);
      const { dependencies, devDependencies } = JSON.parse(packageJson);

      return { ...dependencies, ...devDependencies };

    } catch (err) {

      return null;
    }
  }

  static async add(pkg) {

    const hasYarn = await this.#detectYarn();
    const packages = await this.#getPackages();
    const hasPackage = packages.hasOwnProperty(pkg);
    if (hasPackage) return;

    print('warning', `[Arnelify React Native]: Installing package: '${pkg}'...`);
    await exec(hasYarn ? `yarn add ${pkg}` : `npm install ${pkg}`);
  }

  static async dev(pkg) {

    const hasYarn = await this.#detectYarn();
    const packages = await this.#getPackages();
    const hasPackage = packages.hasOwnProperty(pkg);
    if (hasPackage) return;

    print('warning', `[Arnelify React Native]: Installing package: '${pkg}'...`);
    await exec(hasYarn ? `yarn add -D ${pkg}` : `npm install ${pkg} --save-dev`);
  }

  static async remove(pkg) {

    const hasYarn = await this.#detectYarn();
    const packages = await this.#getPackages();
    const hasPackage = packages.hasOwnProperty(pkg);
    if (!hasPackage) return;

    print('warning', `[Arnelify React Native]: Removing unusual package: '${pkg}'...`);
    await exec(hasYarn ? `yarn remove ${pkg}` : `npm uninstall ${pkg}`);
  }
}

module.exports = Plant;