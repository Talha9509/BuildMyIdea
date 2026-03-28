/*
  Warnings:

  - A unique constraint covering the columns `[repoLink]` on the table `Submit` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photo" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Submit_repoLink_key" ON "Submit"("repoLink");
