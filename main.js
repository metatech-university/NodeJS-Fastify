'use strict';

const { resolve } = require('node:path');
const { readFile } = require('node:fs/promises');

const fastify = require('fastify');

const { Logger, StreamForLogger } = require('./src/logger.js');
const http = require('./src/http.js');
const ws = require('./src/ws.js');
const { loadApplication } = require('./src/loader.js');

const APPLICATIONS_FILE_PATH = '.applications';
const LOG_FOLDER_PATH = './log';

const getAppPaths = async (appFilePath) => {
  const appsFile = await readFile(resolve(appFilePath), {
    encoding: 'utf8',
  });

  return appsFile.split('\n').filter((path) => path.trim() !== '');
};

(async () => {
  const streamForLogger = new StreamForLogger(LOG_FOLDER_PATH);
  const server = fastify({
    logger: { level: 'info', stream: streamForLogger },
  });
  const logger = new Logger(server.log);

  const appPath = (await getAppPaths(APPLICATIONS_FILE_PATH))[0];
  const app = await loadApplication(appPath, logger);

  http.init(server, app.api);
  http.initStatic(server, appPath);
  ws.init(server, app.api);
  http.start(server, { port: app.config.server.ports[0] });
})();
