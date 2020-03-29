import _ from 'lodash/fp';
import ytdl from 'ytdl-core';
import { Message } from 'discord.js';

export const name = 'play';
export const description = 'Plays the audio of a youtube video';
export const execute = async (message: Message, args: [string]) => {
  const channel = message?.member?.voice.channel;
  const connection = await channel?.join();

  if (!connection) throw new Error('could not establish connection');

  const url = _.head(args);
  if (!url) throw new TypeError('invalid url');

  const stream = ytdl(url, {
    quality: 'highestaudio'
  });

  connection.play(stream);
};
