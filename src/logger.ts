import _ from 'lodash/fp';
import Pino from 'pino';

const __DEV__ = _.eq(process.env.NODE_ENV, 'development');

export const logger = Pino({
  prettyPrint: __DEV__
});
