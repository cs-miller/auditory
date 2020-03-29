//@ts-check
import _ from 'lodash/fp';
import ytdl from 'ytdl-core';
import { Message } from 'discord.js';

module.exports = {
  name: 'play',
  description: 'Plays the audio of a youtube video',
  /**
   * @param {import('discord.js').Message} message
   * @param {any} args
   */
  async execute(message: Message, args: [string]) {
    //@ts-ignore
    const channel = message.member.voice.channel;
    //@ts-ignore
    const connection = await channel.join();

    const url = _.head(args);
    if (!url) throw new TypeError('invalid url');

    const stream = ytdl(url, {
      quality: 'highestaudio'
    });

    connection.play(stream);
  }
};
