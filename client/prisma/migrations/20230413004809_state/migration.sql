/*
  Warnings:

  - You are about to drop the column `wheelColor` on the `Game` table. All the data in the column will be lost.
  - Added the required column `state` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winningColor` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" TEXT NOT NULL,
    "winningColor" TEXT NOT NULL,
    "wheelValue" INTEGER NOT NULL
);
INSERT INTO "new_Game" ("createdAt", "id", "wheelValue") SELECT "createdAt", "id", "wheelValue" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
