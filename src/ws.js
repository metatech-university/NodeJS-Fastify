'use strict';

const websocket = require('@fastify/websocket');

function init(routes, fastify) {
  fastify.register(websocket);
  fastify.register(async (fastify) => {
    fastify.get(
      '/api',
      { websocket: true },
      (connection /* SocketStream */ /* req: FastifyRequest */) => {
        const ip = connection.socket.remoteAddress;
        connection.socket.on('message', async (message) => {
          try {
            const { name, method, args = [] } = JSON.parse(message);
            const handler = routes?.[name]?.[method];

            if (!handler)
              return connection.send('"Not found"', { binary: false });

            const json = JSON.stringify(args);
            const parameters = json.substring(1, json.length - 1);
            console.log(`${ip} ${name}.${method}(${parameters})`);

            const result = await handler(...args);
            connection.send(JSON.stringify(result), { binary: false });
          } catch (err) {
            console.error(err);
            connection.send('"Server error"', { binary: false });
          }
        });
      },
    );
  });
}

module.exports = { init };
