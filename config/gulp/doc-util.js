var pkg = require('../../package.json');
var gutil = require('gulp-util');
var chalk = gutil.colors;
var notifier = require('node-notifier');

var shellPrefix = '$';

//Danish Flag
function drawFlag () {
  
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );

  gutil.log(
    chalk.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );

  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
}

function notify (title, message, wait) {
  notifier.notify({
    title: title,
    message: message,
    icon: 'src/img/favicons/favicon-192.png',
    wait: wait,
  });
}

module.exports = {

  pkg: {

    name: pkg.name,
    version: pkg.version,

  },

  dirName: pkg.name + '-' + pkg.version,

  logIntroduction: function (message) {

    message = message || 'Det Fælles Designsystem';

    gutil.log(
      chalk.yellow('v' + pkg.version),
      message
    );
    drawFlag();
    //gutil.log(
      //chalk.yellow('v' + pkg.version),
      //'The following gulp commands are available'
    //);

  },

  logCommand: function (name, message) {

    gutil.log(
      shellPrefix,
      chalk.cyan(name),
      chalk.magenta(message)
    );

  },

  logHelp: function (name, message) {

    gutil.log(
      shellPrefix,
      chalk.cyan(name),
      chalk.yellow(message)
    );

  },

  logData: function (name, message) {

    gutil.log(
      chalk.cyan(name),
      chalk.yellow(message)
    );

  },

  logError: function (name, message) {

    gutil.log(
      chalk.red(name),
      chalk.yellow(message)
    );
    notify(this.dirName + ' gulp ' + name, message, true);

  },

  logMessage: function (name, message) {

    gutil.log(
      chalk.cyan(name),
      chalk.green(message)
    );
    notify(this.dirName + ' gulp ' + name, message, false);

  },

};
