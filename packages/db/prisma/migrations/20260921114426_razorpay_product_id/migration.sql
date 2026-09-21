/*
  Warnings:

  - A unique constraint covering the columns `[razorpayProductId]` on the table `Dev` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Dev" ADD COLUMN     "razorpayProductId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Dev_razorpayProductId_key" ON "Dev"("razorpayProductId");
