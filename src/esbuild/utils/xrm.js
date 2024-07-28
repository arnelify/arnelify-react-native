const path = require("path");
const { readdir, stat, rm, unlink } = require('fs/promises');

/**
 * X Remove
 * @param {string} src 
 * @param {Array} excludes 
 */
const xrm = async (src, excludes = []) => {
  
  const items = await readdir(src);

  items.forEach(async (item) => {
    const isExcluded = excludes.includes(item);
    if (isExcluded) return;

    const itemPath = path.resolve(src, item);

    const stats = await stat(itemPath);
    const isDirectory = stats.isDirectory();
    if (isDirectory) {
      await rm(itemPath, { recursive: true, force: true });
      return;
    }

    unlink(itemPath);
  });

};

module.exports = xrm;