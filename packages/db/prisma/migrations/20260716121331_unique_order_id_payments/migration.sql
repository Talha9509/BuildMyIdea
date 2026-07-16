/*
  Warnings:

  - A unique constraint covering the columns `[razorpayOrderId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payments_razorpayOrderId_key" ON "Payments"("razorpayOrderId");
