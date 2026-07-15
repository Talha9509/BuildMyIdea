/*
  Warnings:

  - A unique constraint covering the columns `[razorpayAccountId]` on the table `Dev` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[winnerSubmitId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('Deposit', 'Payout');

-- CreateEnum
CREATE TYPE "ProjectPaymentStatus" AS ENUM ('Unpaid', 'Paid', 'Completed');

-- AlterTable
ALTER TABLE "Dev" ADD COLUMN     "iifscCode" TEXT,
ADD COLUMN     "razorpayAccountId" TEXT,
ADD COLUMN     "upiId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "bounty" INTEGER,
ADD COLUMN     "equity" INTEGER,
ADD COLUMN     "paymentStatus" "ProjectPaymentStatus" NOT NULL DEFAULT 'Unpaid',
ADD COLUMN     "winnerSubmitId" INTEGER;

-- CreateTable
CREATE TABLE "Payments" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dev_razorpayAccountId_key" ON "Dev"("razorpayAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_winnerSubmitId_key" ON "Project"("winnerSubmitId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_winnerSubmitId_fkey" FOREIGN KEY ("winnerSubmitId") REFERENCES "Submit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
