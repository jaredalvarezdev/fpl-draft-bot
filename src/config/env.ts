// src/config/env.ts
import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno: ${name}`);
  }
  return value;
}

export const env = {
  discordToken: requireEnv('DISCORD_TOKEN'),
  clientId: requireEnv('DISCORD_CLIENT_ID'),
  // Guild ID de tu servidor de pruebas: registrar comandos aquí es instantáneo,
  // a diferencia del registro global que tarda hasta 1 hora en propagarse.
  devGuildId: process.env.DISCORD_DEV_GUILD_ID,
};