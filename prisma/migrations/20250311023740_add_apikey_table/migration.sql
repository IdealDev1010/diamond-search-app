/*
  Warnings:

  - You are about to drop the column `key` on the `APIKey` table. All the data in the column will be lost.
  - Added the required column `keyText` to the `APIKey` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_APIKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "keyText" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_APIKey" ("createdAt", "id") SELECT "createdAt", "id" FROM "APIKey";
DROP TABLE "APIKey";
ALTER TABLE "new_APIKey" RENAME TO "APIKey";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
