/*
  Warnings:

  - You are about to alter the column `amount` on the `Bet` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bet" ("amount", "createdAt", "id", "type", "userId") SELECT "amount", "createdAt", "id", "type", "userId" FROM "Bet";
DROP TABLE "Bet";
ALTER TABLE "new_Bet" RENAME TO "Bet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
