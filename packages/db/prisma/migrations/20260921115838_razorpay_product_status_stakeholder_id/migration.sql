/*
  Warnings:

  - A unique constraint covering the columns `[razorpayStakeholderId]` on the table `Dev` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RouteStatus" AS ENUM ('requested', 'needs_clarification', 'under_review', 'activated', 'suspended');

-- AlterTable
ALTER TABLE "Dev" ADD COLUMN     "razorpayProductStatus" "RouteStatus",
ADD COLUMN     "razorpayStakeholderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Dev_razorpayStakeholderId_key" ON "Dev"("razorpayStakeholderId");
