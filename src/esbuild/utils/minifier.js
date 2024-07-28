/**
 * Minifier
 * @param {string} code 
 * @param {Array} aRows 
 * @returns 
 */
const minifier = (code, aRows = []) => {

  const isWin = code.indexOf("\r\n") + 1 !== 0;
  const eol = isWin ? "\r\n" : "\n";

  const aData = code.split(eol);
  for (const row of aData) {
    aRows.push(row.trim());
  }

  return aRows.join('');
};

module.exports = minifier;