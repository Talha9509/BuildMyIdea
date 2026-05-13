/*
  Warnings:

  - A unique constraint covering the columns `[ProjectId,userId]` on the table `Stars` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ProjectId` to the `Stars` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Stars_submitId_userId_key";

-- AlterTable
ALTER TABLE "Stars" ADD COLUMN     "ProjectId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stars_ProjectId_userId_key" ON "Stars"("ProjectId", "userId");

-- AddForeignKey
ALTER TABLE "Stars" ADD CONSTRAINT "Stars_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
