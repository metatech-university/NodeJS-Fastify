'use strict';

function init(routes, server) {
  /* TODO: session support */
  for (const [iface, methods] of Object.entries(routes)) {
    for (const [method, handler] of Object.entries(methods)) {
      if (typeof handler !== 'function') {
        continue;
      }

      server.post(`/api/${iface}/${method}`, async (request) => {
        const response = await handler({
          ...request.query,
          ...request.body,
          headers: request.headers,
        });

        return response;
      });
    }
  }
}

async function start(server, config) {
  await server.listen(config);
  server.log.info(`API on port ${config.port}`);
}

module.exports = {
  init,
  start,
};
