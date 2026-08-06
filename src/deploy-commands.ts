// src/deploy-commands.ts
import { REST, Routes } from 'discord.js';
import { env } from './config/env';
import { loadCommands } from './utils/commandLoader';

async function deployCommands() {
  const commands = loadCommands();
  const commandsData = commands.map((command) => command.data.toJSON());

  const rest = new REST().setToken(env.discordToken);

  try {
    console.log(`Registrando ${commandsData.length} comando(s)...`);

    if (env.devGuildId) {
      await rest.put(
        Routes.applicationGuildCommands(env.clientId, env.devGuildId),
        { body: commandsData },
      );
      console.log(`Comandos registrados en el servidor de pruebas (${env.devGuildId}).`);
    } else {
      await rest.put(Routes.applicationCommands(env.clientId), { body: commandsData });
      console.log('Comandos registrados globalmente (puede tardar hasta 1 hora en propagarse).');
    }
  } catch (error) {
    console.error('Error registrando comandos:', error);
  }
}

deployCommands();