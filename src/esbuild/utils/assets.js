/**
 * Assets
 */
class Assets {
  
  /**
   * Get Assets
   * @param {Object} files 
   * @param {Array} assets 
   * @param {Array} styles 
   * @param {Array} scripts 
   * @returns {Array}
   */
  static get(files, assets = [], styles = [], scripts = []) {

    const isDevelopment = process.argv.includes("run-web");
    if (isDevelopment) {
      assets.push('socket.io/socket.io.js');
      assets.push('watch.js');
    }

    for (const filename in files) {
      const [, bundle] = filename.split('/');
      assets.push(bundle);
    }

    for (const asset of assets) {
      const isStyle = asset.endsWith('.css');
      if (isStyle) {
        const tag = `<link href="/${asset}" rel="stylesheet" />`;
        styles.push(tag);
      }

      const isScript = asset.endsWith('.js');
      if (isScript) {
        const tag = `<script src="/${asset}"></script>`;
        scripts.push(tag);
      }
    }

    return [styles, scripts];
  }

  /**
   * Set Assets
   * @param {string} template
   * @param {Array} styles 
   * @param {Array} scripts 
   * @returns {string}
   */
  static set(template, styles = [], scripts = []) {

    const isWin = template.indexOf("\r\n") + 1 !== 0;
    const eol = isWin ? "\r\n  " : "\n  ";

    const stylesTarget = '<!-- Styles -->';
    const scriptsTarget = '<!-- Scripts -->';

    const contents = template.replace(stylesTarget, styles.join(eol))
      .replace(scriptsTarget, scripts.join(eol));

    return contents;
  }
}

module.exports = Assets;