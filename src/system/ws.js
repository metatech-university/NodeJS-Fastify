'use strict';

const websocket = require('@fastify/websocket');

function init(server, routes) {
  server.register(websocket);
  server.register(async (server) => {
    server.get(
      '/api',
      { websocket: true },
      (connection /* SocketStream */ /* req: FastifyRequest */) => {
        connection.socket.on('message', async (message) => {
          try {
            const { name, method, args = [] } = JSON.parse(message);
            const handler = routes?.[name]?.[method];

            if (!handler)
              return connection.send('"Not found"', { binary: false });

            const result = await handler(...args);
            connection.send(JSON.stringify(result), { binary: false });
          } catch (err) {
            server.log.error(err);
            connection.send('"Server error"', { binary: false });
          }
        });
      },
    );
  });
}

module.exports = { init };
