/*
  Warnings:

  - You are about to drop the column `contributonpercent` on the `Submit` table. All the data in the column will be lost.
  - You are about to drop the column `devId` on the `Submit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Submit" DROP CONSTRAINT "Submit_devId_fkey";

-- DropIndex
DROP INDEX "Submit_projectId_devId_key";

-- AlterTable
ALTER TABLE "Submit" DROP COLUMN "contributonpercent",
DROP COLUMN "devId";
