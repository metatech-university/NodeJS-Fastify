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

class StreamForLogger {
  constructor(logFileStream, date) {
    this.logFileStream = logFileStream;
    this.date = date;
  }
  write(msg) {
    process.stdout.write(msg);
    const currentDate = new Date().toISOString().substring(0, 10);
    if (currentDate !== this.date) {
      this.date = currentDate;
      this.logFileStream.end();
      const filePath = path.join(LOG_FOLDER_PATH, `${this.date}.log`);
      this.logFileStream = fs.createWriteStream(filePath, { flags: 'a' });
    }
    this.logFileStream.write(msg);
  }
};

module.exports = {
  Logger,
  StreamForLogger,
};
