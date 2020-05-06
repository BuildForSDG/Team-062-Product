#!/usr/bin/env node

/**
 * Module dependencies.
 */

import http from 'http';
import debug from 'debug';
import app from '../app';
import env from '../configs/env';

debug('yourright:server');
const { error, info } = console;

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// const terminate = (server, options = { coredump: false, timeout: 500 }) => {
//   // Exit function
//   // const exit = (code) => {
//   //   options.coredump ? process.abort() : process.exit(code);
//   // };

//   return (code, reason) => (err) => {
//     if (err && err instanceof Error) {
//       // Log error information, use a proper logging library here :)
//       // console.log(err.message, err.stack);
//     }

//     // Attempt a graceful shutdown
//     server.close(exit);
//     setTimeout(exit, options.timeout).unref();
//   };
// };

const port = normalizePort(env.appPort || '5000');

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (err) => {
  if (err.syscall !== 'listen') {
    throw err;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (err.code) {
    case 'EACCES':
      error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
};

/**
 * Get port from environment and store in Express.
 */

app.set('port', port);

const exitHandler = terminate(server, {
  coredump: false,
  timeout: 500
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => info(`App is live and listening on port ${env.appPort || '5000'}!`));
server.on('error', onError);
server.on('listening', onListening);

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));
