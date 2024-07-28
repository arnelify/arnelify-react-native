const path = require("path");
const { copyFile, readdir, mkdir, stat } = require("fs/promises");

/**
 * X Copy
 * @param {string} src 
 * @param {string} dest 
 * @returns {void}
 */
const xcopy = async (src, dest) => {

  const stats = await stat(src);
  const isDirectory = stats.isDirectory();
  if (!isDirectory) {
    await copyFile(src, dest);
    return;
  }

  await mkdir(dest, { recursive: true });

  const items = await readdir(src);
  for (const item of items) {
    await xcopy(path.join(src, item), path.join(dest, item));
  }
};

module.exports = xcopy;