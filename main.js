'use strict';

const fastify = require('fastify');

const path = require('node:path');

const { Logger } = require('./src/system/logger.js');
const http = require('./src/system/http');
const ws = require('./src/system/ws');

const { loadApplication } = require('./src/system/loader.js');
const APPLICATION_PATH = path.join(process.cwd(), '../NodeJS-Application');

(async () => {
  const server = fastify({ logger: true });
  const logger = new Logger(server.log);

  const app = await loadApplication(APPLICATION_PATH, logger);

  http.init(server, app.api);
  /* HTTP STATIC */
  ws.init(server, app.api);
  http.start(server, { port: app.config.server.ports[0] });
})();
