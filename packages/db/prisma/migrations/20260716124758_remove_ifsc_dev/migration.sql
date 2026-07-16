/*
  Warnings:

  - You are about to drop the column `iifscCode` on the `Dev` table. All the data in the column will be lost.
  - You are about to drop the column `upiId` on the `Dev` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dev" DROP COLUMN "iifscCode",
DROP COLUMN "upiId";
