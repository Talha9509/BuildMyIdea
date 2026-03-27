/*
  Warnings:

  - You are about to drop the column `Description` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `Skillsreq` on the `Project` table. All the data in the column will be lost.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "Description",
DROP COLUMN "Skillsreq",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "skillsreq" TEXT;
