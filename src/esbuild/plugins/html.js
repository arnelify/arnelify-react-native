const path = require("path");
const Assets = require("../utils/assets");
const minifier = require("../utils/minifier");
const xcopy = require("../utils/xcopy");
const xrm = require("../utils/xrm");

const { readdir, readFile, writeFile } = require('fs/promises');

const htmlEsbuildPlugin = function (minify) {

  const webDir = path.resolve(".", 'web');
  const srcDir = path.resolve(".", 'src/public');

  /** Update Web */
  const updateWeb = async (files) => {

    const srcItems = await readdir(srcDir);
    const [styles, scripts] = Assets.get(files);

    for (const item of srcItems) {
 
      const isIndex = item === 'index.html';
      const srcItem = path.resolve(srcDir, item);
      const webItem = path.resolve(webDir, item);

      if (isIndex) {

        const template = await readFile(srcItem, 'utf-8');
        const contents = Assets.set(template, styles, scripts);
        const index = minify ? minifier(contents) : contents;
        await writeFile(webItem, index);

      } else {

        xcopy(srcItem, webItem);
      }
    }
  };

  return {

    name: 'html-plugin',

    setup(build) {

      build.onStart(async () => {

        const excludes = ['server.js'];
        await xrm(webDir, excludes);
      });

      build.onEnd(async (result) => {

        const files = result.metafile?.outputs;
        await updateWeb(files);
      });
    }
  };
};

module.exports = htmlEsbuildPlugin;