import { prisma } from '../lib/prisma';

export async function getSavedLeagues(guildId: string) {
  return prisma.savedLeague.findMany({
    where: { guildId },
    orderBy: { addedAt: 'asc' },
  });
}

export async function countSavedLeagues(guildId: string): Promise<number> {
  return prisma.savedLeague.count({ where: { guildId } });
}

export async function leagueExists(guildId: string, leagueId: number): Promise<boolean> {
  const found = await prisma.savedLeague.findUnique({
    where: { guildId_leagueId: { guildId, leagueId } },
  });
  return found !== null;
}

export async function addSavedLeague(guildId: string, leagueId: number) {
  await prisma.guild.upsert({
    where: { id: guildId },
    update: {},
    create: { id: guildId },
  });

  return prisma.savedLeague.create({
    data: { guildId, leagueId },
  });
}

export async function removeSavedLeague(guildId: string, leagueId: number): Promise<boolean> {
  try {
    await prisma.savedLeague.delete({
      where: { guildId_leagueId: { guildId, leagueId } },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getGuildPlan(guildId: string): Promise<string> {
  const guild = await prisma.guild.findUnique({ where: { id: guildId } });
  return guild?.plan ?? 'free';
}
