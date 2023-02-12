'use strict';

const path = require('node:path');

const fastigyStatic = require('@fastify/static');

function init(server, routes) {
  /* TODO: session support */
  for (const [iface, methods] of Object.entries(routes)) {
    for (const [method, handler] of Object.entries(methods)) {
      if (typeof handler !== 'function') {
        continue;
      }

      server.post(`/api/${iface}/${method}`, async (request) => {
        const { query, body, headers } = request;
        const response = await handler({ ...query, ...body, headers });
        return response;
      });
    }
  }
}

function initStatic(server, appPath) {
  const staticPath = path.join(appPath, 'static');

  server.register(fastigyStatic, {
    root: staticPath,
    wildcard: true,
  });
}

const start = async (server, config) => {
  await server.listen(config);
  server.log.info(`API on port ${config.port}`);
};

module.exports = {
  init,
  initStatic,
  start,
};
