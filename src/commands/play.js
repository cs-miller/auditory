//@ts-check
const _ = require('lodash/fp');
const ytdl = require('ytdl-core');

module.exports = {
  name: 'play',
  description: 'Plays the audio of a youtube video',
  /**
   * @param {import('discord.js').Message} message
   * @param {any} args
   */
  async execute(message, args) {
    const channel = message.member.voice.channel;
    const connection = await channel.join();

    const url = _.head(args);
    if (!url) throw new TypeError('invalid url');

    const stream = ytdl(url, {
      quality: 'highestaudio'
    });

    connection.play(stream);
  }
};
