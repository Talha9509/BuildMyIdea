-- CreateEnum
CREATE TYPE "RoleContributer" AS ENUM ('Leader', 'Member');

-- AlterTable
ALTER TABLE "SubmissionContributor" ADD COLUMN     "contributionRole" "RoleContributer" NOT NULL DEFAULT 'Leader';
