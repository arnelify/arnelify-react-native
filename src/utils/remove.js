const path = require("path");
const { access, unlink } = require('fs/promises');
const print = require("./print");

const remove = async (file) => {

  const filePath = path.resolve(".", file);

  try {

    await access(filePath);
    await unlink(filePath);

  } catch (err) {

    return;
  }
}

module.exports = remove;