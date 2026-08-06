import { Client, GatewayIntentBits, Events, ChannelType, PermissionsBitField } from 'discord.js';
import { env } from './config/env';
import { loadCommands } from './utils/commandLoader';
import { prisma } from './lib/prisma';
import { buildShortWelcomeEmbed } from './utils/welcomeEmbed';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commands = loadCommands();

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Bot conectado como ${readyClient.user.tag}`);

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Conexión a la base de datos verificada.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos al arrancar:', error);
  }
});

client.on(Events.GuildCreate, async (guild) => {
  console.log(`Bot agregado a un nuevo servidor: ${guild.name} (${guild.id})`);

  const embed = buildShortWelcomeEmbed();

  // Intenta el canal de sistema primero (el que Discord usa para mensajes de bienvenida)
  const targetChannel =
    guild.systemChannel &&
    guild.systemChannel
      .permissionsFor(guild.members.me!)
      ?.has(PermissionsBitField.Flags.SendMessages)
      ? guild.systemChannel
      : guild.channels.cache.find(
          (channel) =>
            channel.type === ChannelType.GuildText &&
            channel
              .permissionsFor(guild.members.me!)
              ?.has(PermissionsBitField.Flags.SendMessages),
        );

  if (targetChannel && targetChannel.isTextBased()) {
    try {
      await targetChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error(`No se pudo enviar el mensaje de bienvenida en ${guild.name}:`, error);
    }
  } else {
    console.warn(`No encontré un canal con permisos para enviar bienvenida en ${guild.name}.`);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error ejecutando ${interaction.commandName}:`, error);
    const errorReply = { content: 'Hubo un error al ejecutar el comando.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorReply);
    } else {
      await interaction.reply(errorReply);
    }
  }
});

client.login(env.discordToken);
