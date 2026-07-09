-- DropForeignKey
ALTER TABLE "SubmissionContributor" DROP CONSTRAINT "SubmissionContributor_devId_fkey";

-- DropForeignKey
ALTER TABLE "SubmissionContributor" DROP CONSTRAINT "SubmissionContributor_submitId_fkey";

-- AddForeignKey
ALTER TABLE "SubmissionContributor" ADD CONSTRAINT "SubmissionContributor_submitId_fkey" FOREIGN KEY ("submitId") REFERENCES "Submit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionContributor" ADD CONSTRAINT "SubmissionContributor_devId_fkey" FOREIGN KEY ("devId") REFERENCES "Dev"("id") ON DELETE CASCADE ON UPDATE CASCADE;
