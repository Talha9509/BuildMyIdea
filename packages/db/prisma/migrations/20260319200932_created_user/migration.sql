/*
  Warnings:

  - You are about to drop the column `email` on the `Dev` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Dev` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Dev` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Dev` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Owner` table. All the data in the column will be lost.
  - Added the required column `role` to the `Dev` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Owner` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'DEV');

-- DropIndex
DROP INDEX "Dev_email_key";

-- DropIndex
DROP INDEX "Dev_phone_key";

-- DropIndex
DROP INDEX "Owner_email_key";

-- DropIndex
DROP INDEX "Owner_phone_key";

-- AlterTable
ALTER TABLE "Dev" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "phone",
ADD COLUMN     "role" "Role" NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Dev_id_seq";

-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "phone",
ADD COLUMN     "role" "Role" NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Owner_id_seq";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "phone" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dev" ADD CONSTRAINT "Dev_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
