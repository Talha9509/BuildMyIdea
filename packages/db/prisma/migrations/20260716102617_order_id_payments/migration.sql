/*
  Warnings:

  - Added the required column `razorpayOrderId` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "razorpayOrderId" TEXT NOT NULL;
