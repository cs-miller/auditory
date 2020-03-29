require('dotenv').config();
import _ from 'lodash/fp';
import Discord, { Message } from 'discord.js';
import fs from 'fs';
import path from 'path';

import { logger } from './logger';

export type Command = {
  name: string;
  description: string;
  execute: (message: Message, args: string[]) => Promise<string>;
};

const client = new Discord.Client();
const commandCollection = new Discord.Collection<string, Command | undefined>();

const commandPath = path.resolve(__dirname, './commands');
const commandFiles = _.filter(_.endsWith('.js'), fs.readdirSync(commandPath));

for (let file of commandFiles) {
  const command = require(`./commands/${file}`);
  commandCollection.set(command.name, command);
}

let prefix = '!';

client.once('ready', () => {
  logger.info('ready!');
});

client.on('message', async (message: Message) => {
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
    const commandModule = commandCollection.get(command);
    if (!commandModule) throw new Error('command not found');

    const result = await commandModule.execute(message, args);
    logger.info('command:', command, ' completed with result:', result);
  } catch (err) {
    logger.error('command:', command, 'failed with error:', err);
    message.channel.send(`error while executing "${command}", ${err.message}`, {
      tts: true
    });
  }
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
