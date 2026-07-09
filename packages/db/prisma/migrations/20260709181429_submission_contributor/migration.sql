-- AlterTable
ALTER TABLE "Submit" ADD COLUMN     "contributonpercent" INTEGER;

-- CreateTable
CREATE TABLE "SubmissionContributor" (
    "submitId" INTEGER NOT NULL,
    "devId" INTEGER NOT NULL,
    "contributionPercent" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "SubmissionContributor_pkey" PRIMARY KEY ("submitId","devId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionContributor_projectId_devId_key" ON "SubmissionContributor"("projectId", "devId");

-- AddForeignKey
ALTER TABLE "SubmissionContributor" ADD CONSTRAINT "SubmissionContributor_submitId_fkey" FOREIGN KEY ("submitId") REFERENCES "Submit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionContributor" ADD CONSTRAINT "SubmissionContributor_devId_fkey" FOREIGN KEY ("devId") REFERENCES "Dev"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Move existing data from Submit to SubmissionContributor, including projectId
INSERT INTO "SubmissionContributor" ("submitId", "projectId", "devId", "contributionPercent")
SELECT 
  id as "submitId", 
  "projectId",
  "devId", 
  COALESCE("contributonpercent", 100) as "contributionPercent"
FROM "Submit";