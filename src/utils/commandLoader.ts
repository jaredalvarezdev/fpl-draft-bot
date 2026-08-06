// src/utils/commandLoader.ts
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Collection } from 'discord.js';
import type { Command } from '../commands/command';

export function loadCommands(): Collection<string, Command> {
  const commands = new Collection<string, Command>();
  const commandsPath = join(__dirname, '..', 'commands');
  const domainFolders = readdirSync(commandsPath, { withFileTypes: true }).filter(
    (entry) => entry.isDirectory(),
  );

  for (const folder of domainFolders) {
    const folderPath = join(commandsPath, folder.name);
    const commandFiles = readdirSync(folderPath).filter((file) => file.endsWith('.ts'));

    for (const file of commandFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const commandModule = require(join(folderPath, file));
      const command = Object.values(commandModule)[0] as Command | undefined;

      if (command) {
        commands.set(command.data.name, command);
      }
    }
  }

  return commands;
}