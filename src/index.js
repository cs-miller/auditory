require('dotenv').config();
const _ = require('lodash/fp');
const Pino = require('pino');
const Discord = require('discord.js');

const __DEV__ = _.eq(process.env.NODE_ENV, 'development');

const logger = Pino({
  prettyPrint: __DEV__
});

const client = new Discord.Client();

let prefix = '!';

client.once('ready', () => {
  logger.info('ready!');
});

client.on('message', message => {
  const startsWithPrefix = _.invokeArgs(
    'content.startsWith',
    [prefix],
    message
  );
  if (!startsWithPrefix || message.author.bot) return;
  const [command, ...args] = _.flow(
    _.get('content'),
    _.split(prefix),
    _.tail,
    _.split(' ')
  )(message);
  logger.info('command', command, 'args', args);
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
