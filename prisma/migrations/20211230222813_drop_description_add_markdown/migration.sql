/*
  Warnings:

  - You are about to drop the column `description` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "description",
ADD COLUMN     "markdownContent" TEXT NOT NULL DEFAULT E'';
