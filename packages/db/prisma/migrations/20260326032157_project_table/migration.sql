/*
  Warnings:

  - You are about to drop the column `role` on the `Dev` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Owner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Dev` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Owner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Dev` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Owner` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Dev" DROP CONSTRAINT "Dev_id_fkey";

-- DropForeignKey
ALTER TABLE "Owner" DROP CONSTRAINT "Owner_id_fkey";

-- AlterTable
CREATE SEQUENCE dev_id_seq;
ALTER TABLE "Dev" DROP COLUMN "role",
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('dev_id_seq');
ALTER SEQUENCE dev_id_seq OWNED BY "Dev"."id";

-- AlterTable
CREATE SEQUENCE owner_id_seq;
ALTER TABLE "Owner" DROP COLUMN "role",
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('owner_id_seq');
ALTER SEQUENCE owner_id_seq OWNED BY "Owner"."id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Skillsreq" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dev_userId_key" ON "Dev"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_userId_key" ON "Owner"("userId");

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dev" ADD CONSTRAINT "Dev_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
