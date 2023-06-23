var pkg         = require('../../package.json');
const log = require("fancy-log");
const colors = require("ansi-colors");

const shellPrefix = "$";

//Danish Flag
function drawFlag () {

  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );

  log(
    colors.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );

  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  log(
    colors.red('xxxxxxxxxxxxxxxxxxxx'),
    colors.white('xxxxxxxxxxxx'),
    colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
}

module.exports = {
  pkg: {
    name: pkg.name,
    version: pkg.version
  },

  dirName: `${pkg.name}-${pkg.version}`,

  logIntroduction(message) {
    const introMessage = message || "DKFDS";
    log(colors.yellow(`${introMessage} v${pkg.version}`));
    drawFlag();
  },

  logCommand(name, message) {
    log(shellPrefix, colors.cyan(name), colors.magenta(message));
  },

  logHelp(name, message) {
    log(shellPrefix, colors.cyan(name), colors.yellow(message));
  },

  logData(name, message) {
    log(colors.cyan(name), colors.yellow(message));
  },

  logError(name, message) {
    log(colors.red(name), colors.yellow(message));
  },

  logMessage(name, message) {
    //log(colors.cyan(name), colors.green(message));
  }
};
