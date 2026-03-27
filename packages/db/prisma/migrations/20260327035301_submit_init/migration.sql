-- CreateTable
CREATE TABLE "Submit" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "devId" INTEGER NOT NULL,
    "liveLink" TEXT NOT NULL,
    "repoLink" TEXT NOT NULL,

    CONSTRAINT "Submit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submit" ADD CONSTRAINT "Submit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submit" ADD CONSTRAINT "Submit_devId_fkey" FOREIGN KEY ("devId") REFERENCES "Dev"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
