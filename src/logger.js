const _ = require('lodash/fp');
const Pino = require('pino');

const __DEV__ = _.eq(process.env.NODE_ENV, 'development');

const logger = Pino({
  prettyPrint: __DEV__
});

module.exports = {
  logger
};
