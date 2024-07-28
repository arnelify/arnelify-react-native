const print = require("../utils/print");
const { exec: command } = require("child_process");

const exec = (cmd, silent = true) => {

  return new Promise((resolve, reject) => {

    let body = '';

    const child = command(cmd);

    child.stdout.on('data', (data) => {
      if (!silent) console.log(data.trim());
      body += data.trim();
    });

    child.stderr.on('data', (data) => {
      print(`StdErr: ${data}`);
      reject(null);
    });
    child.on('error', (error) => {
      print(`Error: ${error}`);
      reject(null);
    });

    child.on('close', (code) => {
      const isSuccess = code === 0;
      if (!isSuccess) {
        print(`Exited with code: ${code}`);
        reject(null);
      }

      resolve(body);
    });
  });
}

module.exports = exec;