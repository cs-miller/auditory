//@ts-check
require('dotenv').config();
const _ = require('lodash/fp');
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

const { logger } = require('./logger');

const client = new Discord.Client();
const commandCollection = new Discord.Collection();

const commandPath = path.resolve(__dirname, './commands');
const commandFiles = fs.readdirSync(commandPath);

for (let file of commandFiles) {
  const command = require(`./commands/${file}`);
  commandCollection.set(command.name, command);
}

let prefix = '!';

client.once('ready', () => {
  logger.info('ready!');
});

client.on('message', async message => {
  const startsWithPrefix = message.content.startsWith(prefix);
  if (!startsWithPrefix || message.author.bot) return;
  const [command, ...args] = _.flow(
    _.get('content'),
    _.split(prefix),
    _.tail,
    _.split(' '),
    _.remove(_.isEmpty)
  )(message);

  logger.info('executing command:', command, 'with args:', args);

  try {
    const result = await commandCollection.get(command).execute(message, args);
    logger.info('command:', command, ' completed with result:', result);
  } catch (err) {
    logger.error('command:', command, 'failed with error:', err);
    message.channel.send(`error while executing "${command}", ${err.message}`, {
      tts: true
    });
  }
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
