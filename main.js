'use strict';

const fsp = require('node:fs/promises');

const fastify = require('fastify');

const { Logger, StreamForLogger } = require('./src/logger.js');
const http = require('./src/http.js');
const ws = require('./src/ws.js');
const { loadApplication } = require('./src/loader.js');

const LOG_FOLDER_PATH = './log';

const getAppPaths = async () => {
  const apps = await fsp.readFile('.applications', 'utf8');
  return apps.split(/[\r\n\s]+/).filter((s) => s.length !== 0);
};

(async () => {
  const stream = new StreamForLogger(LOG_FOLDER_PATH);
  const server = fastify({
    logger: { level: 'info', stream },
  });
  const logger = new Logger(server.log);

  const appPath = (await getAppPaths())[0];
  const app = await loadApplication(appPath, logger);

  http.init(server, app.api);
  http.initStatic(server, appPath);
  ws.init(server, app.api);
  http.start(server, { port: app.config.server.ports[0] });
})();
