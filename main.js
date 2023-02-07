'use strict';

const fastify = require('fastify');

const { Logger } = require('./src/logger.js');
const common = require('./src/common.js');

const http = require('./src/http');
const ws = require('./src/ws');

(async () => {
  const server = fastify({ logger: true });

  const logger = new Logger(server.log);

  const sandbox = {
    console: Object.freeze(logger),
    common: Object.freeze(common),
  };

  const routes = {
    iface: {
      method: (...args) => {
        logger.log(args, 'dasd', 'asdsa', 'asdasd', { asdas: 321 });
        return { status: 'ok' };
      },
    },
  };

  http.init(routes, server);
  ws.init(routes, server);
  http.start(server, { port: 3000 });
})();
