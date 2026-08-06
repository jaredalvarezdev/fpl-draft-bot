-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedLeague" (
    "id" TEXT NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "guildId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedLeague_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedLeague_guildId_leagueId_key" ON "SavedLeague"("guildId", "leagueId");

-- AddForeignKey
ALTER TABLE "SavedLeague" ADD CONSTRAINT "SavedLeague_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
