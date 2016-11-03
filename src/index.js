import 'babel-polyfill';

import { validate, encodeAuth } from './util';

const defaultLogger = () => {};

export const createStream = (host, stream, { auth = null, logger = defaultLogger } = {}) => {
  validate(host, 'host', 'string', true);
  validate(stream, 'stream', 'string', true);
  validate(logger, 'logger', 'function', true);
  validate(auth, 'auth', 'object');
  let encodedAuth = undefined;
  if (auth) {
    validate(auth.user, 'auth.user', 'string', true);
    validate(auth.pass, 'auth.pass', 'string', true);
    encodedAuth = encodeAuth(auth);
  }

  const streamWriter = require('./streamWriter');
  const streamSubscriber = require('./streamSubscriber');

  logger(`Creating stream object for host: ${host}, stream: ${stream}`);

  return {
    write: streamWriter.default(host, stream, encodedAuth, logger),
    subscribe: streamSubscriber.default(host, stream, encodedAuth, logger),
  };
};
