'use strict';

const { util } = require('node:util');

class Logger {
  constructor(logger) {
    this.logger = logger;
  }

  log(data, ...args) {
    const msg = args.length <= 1 ? args[0] : args;
    this.logger.info(data, msg);
  }

  dir(...args) {
    const msg = util.inspect(...args);
    this.logger.info(msg);
  }

  debug(data, ...args) {
    const msg = args.length <= 1 ? args[0] : args;
    this.logger.debug(data, msg);
  }

  error(data, ...args) {
    const msg = args.length <= 1 ? args[0] : args;
    this.logger.error(data, msg);
  }

  system(...args) {
    const msg = util.format(...args);
    this.logger.info(msg);
  }

  access(...args) {
    const msg = util.format(...args);
    this.logger.info(msg);
  }
}

module.exports = {
  Logger,
};
