import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../command';

export const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde con la latencia del bot'),

  async execute(interaction) {
    const sent = await interaction.reply({
      content: 'Calculando...',
      withResponse: true,
    });

    const latency = sent.resource?.message
      ? sent.resource.message.createdTimestamp - interaction.createdTimestamp
      : 0;

    await interaction.editReply(
      `🏓 Pong! Latencia: ${latency}ms | API: ${Math.round(interaction.client.ws.ping)}ms`,
    );
  },
};