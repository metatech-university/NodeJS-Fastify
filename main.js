'use strict';

const http = require('./src/http');
const ws = require('./src/ws');

(async () => {
  const routes = {
    iface: {
      method: (...args) => {
        console.log(args);
        return { status: 'ok' };
      },
    },
  };

  const server = http.init(routes);
  ws.init(routes, server);
  http.start(server, { port: 3000 });
})();
