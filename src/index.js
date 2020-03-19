require('dotenv').config();
const Pino = require('pino');
const Discord = require('discord.js');

const logger = Pino();
const client = new Discord.Client();

client.once('ready', () => {
  logger.info('ready!');
});

client.on('message', message => {
  logger.info(message.content);
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
