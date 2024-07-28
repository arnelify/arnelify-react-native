const print = (color, message) => {

  const reset = "\x1b[0m";
  const success = "\x1b[32m";
  const warning = "\x1b[33m";
  const danger = "\x1b[31m";

  if (color === 'primary') console.log(message);
  if (color === 'success') console.log(success + message + reset);
  if (color === 'warning') console.log(warning + message + reset);
  if (color === 'danger') console.log(danger + message + reset);
};

module.exports = print;