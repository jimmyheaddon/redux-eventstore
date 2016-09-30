'use strict';

const { get, validate, sleep } = require('./util');

async function pollStream(host, stream, dispatch, pollPeriod) {
  let index = 0;
  while (true) {
    try {
      const event = await get(`${host}/streams/${stream}/${index}`);
      dispatch({ type: event.content.eventType, ...event.content.data });
      index++;
    } catch (e) {
      await sleep(pollPeriod);
    }
  }
}

const subscribeToStream = (host, stream, dispatch, pollPeriod=1000) => {
  validate(host, 'host', 'string', true);
  validate(stream, 'stream', 'string', true);
  validate(dispatch, 'dispatch', 'function');
  validate(pollPeriod, 'pollPeriod', 'number');

  return pollStream(host, stream, dispatch, pollPeriod);
};

module.exports = subscribeToStream;
