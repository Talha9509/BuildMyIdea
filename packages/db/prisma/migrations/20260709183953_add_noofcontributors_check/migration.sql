-- AlterTable
ALTER TABLE "Submit" ADD CONSTRAINT "NoofContributors_range_check" CHECK ("NoofContributors" >= 1 AND "NoofContributors" <= 4);