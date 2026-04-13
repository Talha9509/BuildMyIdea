/*
  Warnings:

  - A unique constraint covering the columns `[projectId,devId]` on the table `Submit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Submit_projectId_devId_key" ON "Submit"("projectId", "devId");
