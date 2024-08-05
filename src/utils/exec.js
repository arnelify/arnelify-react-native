const print = require("./print");
const { exec: command } = require("child_process");

const exec = (cmd, silent = true) => {

  return (new Promise((resolve, reject) => {

    let body = '';

    const child = command(cmd);

    child.stdout.on('data', (data) => {
      if (!silent) console.log(data.trim());
      body += data.trim();
    });

    child.stderr.on('data', (data) => {
      print('danger', `StdErr: ${data}`);
      reject(null);
    });
    child.on('error', (error) => {
      print('danger', `Error: ${error}`);
      reject(null);
    });

    child.on('close', (code) => {
      const isSuccess = code === 0;
      if (!isSuccess) {
        print('danger', `Exited with code: ${code}`);
        reject(null);
      }

      resolve(body);
    });
  })).catch(() => process.exit());
}

module.exports = exec;