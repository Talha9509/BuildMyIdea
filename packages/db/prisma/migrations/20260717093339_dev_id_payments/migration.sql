/*
  Warnings:

  - A unique constraint covering the columns `[razorpayTransferId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "devId" INTEGER,
ADD COLUMN     "razorpayTransferId" TEXT,
ALTER COLUMN "razorpayOrderId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payments_razorpayTransferId_key" ON "Payments"("razorpayTransferId");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_devId_fkey" FOREIGN KEY ("devId") REFERENCES "Dev"("id") ON DELETE SET NULL ON UPDATE CASCADE;
