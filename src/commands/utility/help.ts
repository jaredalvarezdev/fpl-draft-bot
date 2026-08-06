import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../command';
import { buildFullHelpEmbed } from '../../utils/welcomeEmbed';

export const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra cómo usar el bot y la lista de comandos') as SlashCommandBuilder,

  execute: async (interaction) => {
    await interaction.reply({ embeds: [buildFullHelpEmbed()] });
  },
};
