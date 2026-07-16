-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Processing', 'Success', 'Failed');

-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'Processing';
