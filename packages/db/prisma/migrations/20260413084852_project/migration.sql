/*
  Warnings:

  - Added the required column `mainFeature` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "mainFeature" TEXT NOT NULL,
ADD COLUMN     "refrenceLink" TEXT;
