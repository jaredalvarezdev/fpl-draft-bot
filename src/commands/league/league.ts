import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../command';
import { fplDraftClient } from '../../services/fpl/fplDraftClient';
import type { FplLeague } from '../../services/fpl/fplTypes';
import {
  getSavedLeagues,
  countSavedLeagues,
  leagueExists,
  addSavedLeague,
  removeSavedLeague,
} from '../../repositories/leagueRepository';
import { FREE_LEAGUE_LIMIT } from '../../config/limits';

const DRAFT_STATUS_LABELS: Record<string, string> = {
  pre: '⏳ Aún no inicia',
  in_progress: '🟢 En progreso',
  post: '✅ Finalizado',
};

function formatDraftStatus(league: FplLeague): string {
  return DRAFT_STATUS_LABELS[league.draft_status] ?? league.draft_status;
}

function formatDraftDate(league: FplLeague): string {
  const date = new Date(league.draft_dt);
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: league.draft_tz_show,
  }).format(date);
}

export const leagueCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('league')
    .setDescription('Gestiona las ligas de FPL Draft de este servidor')
    .addSubcommand((sub) =>
      sub
        .setName('info')
        .setDescription('Muestra información de una liga')
        .addIntegerOption((option) =>
          option.setName('id').setDescription('El ID de la liga (ej. 9850)').setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Guarda una liga para este servidor')
        .addIntegerOption((option) =>
          option.setName('id').setDescription('El ID de la liga a guardar').setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription('Elimina una liga guardada de este servidor')
        .addIntegerOption((option) =>
          option.setName('id').setDescription('El ID de la liga a eliminar').setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub.setName('list').setDescription('Muestra las ligas guardadas en este servidor'),
    ) as SlashCommandBuilder,

  execute: async (interaction) => {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;

    if (!guildId) {
      await interaction.reply({
        content: 'Este comando solo funciona dentro de un servidor.',
        ephemeral: true,
      });
      return;
    }

    if (subcommand === 'info') {
      const leagueId = interaction.options.getInteger('id', true);
      await interaction.deferReply();

      try {
        const data = await fplDraftClient.getLeagueDetails(leagueId);
        const { league, league_entries } = data;

        const embed = new EmbedBuilder()
          .setTitle(league.name)
          .addFields(
            { name: 'Estado del draft', value: formatDraftStatus(league), inline: true },
            {
              name: 'Equipos',
              value: `${league_entries.length}/${league.max_entries}`,
              inline: true,
            },
            { name: 'Fecha del draft', value: formatDraftDate(league), inline: false },
          )
          .setColor(0x37003c)
          .setFooter({ text: `ID de liga: ${league.id}` });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error(`Error en /league info id=${leagueId}:`, error);
        await interaction.editReply(
          'No pude obtener los datos de esa liga. Verifica que el ID sea correcto.',
        );
      }
      return;
    }

    if (subcommand === 'add') {
      const leagueId = interaction.options.getInteger('id', true);
      await interaction.deferReply();

      const alreadySaved = await leagueExists(guildId, leagueId);
      if (alreadySaved) {
        await interaction.editReply('Esa liga ya está guardada en este servidor.');
        return;
      }

      const currentCount = await countSavedLeagues(guildId);
      if (currentCount >= FREE_LEAGUE_LIMIT) {
        await interaction.editReply(
          `Este servidor ya alcanzó el límite gratuito de ${FREE_LEAGUE_LIMIT} ligas. ` +
            `Elimina alguna con \`/league remove\` o mejora tu plan para agregar más.`,
        );
        return;
      }

      try {
        const data = await fplDraftClient.getLeagueDetails(leagueId);
        await addSavedLeague(guildId, leagueId);
        await interaction.editReply(
          `Liga **${data.league.name}** (ID ${leagueId}) guardada. (${currentCount + 1}/${FREE_LEAGUE_LIMIT})`,
        );
      } catch (error) {
        console.error(`Error en /league add id=${leagueId}:`, error);
        await interaction.editReply(
          'No pude validar esa liga contra la API de FPL. Verifica que el ID sea correcto.',
        );
      }
      return;
    }

    if (subcommand === 'remove') {
      const leagueId = interaction.options.getInteger('id', true);
      await interaction.deferReply();

      const removed = await removeSavedLeague(guildId, leagueId);
      await interaction.editReply(
        removed
          ? `Liga con ID ${leagueId} eliminada de este servidor.`
          : `No encontré una liga guardada con ID ${leagueId} en este servidor.`,
      );
      return;
    }

    if (subcommand === 'list') {
      await interaction.deferReply();

      const saved = await getSavedLeagues(guildId);
      if (saved.length === 0) {
        await interaction.editReply(
          `Este servidor no tiene ligas guardadas. Usa \`/league add\` para agregar una (máximo ${FREE_LEAGUE_LIMIT} gratis).`,
        );
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('Ligas guardadas en este servidor')
        .setDescription(saved.map((s) => `• ID \`${s.leagueId}\``).join('\n'))
        .setFooter({ text: `${saved.length}/${FREE_LEAGUE_LIMIT} usados` })
        .setColor(0x37003c);

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
