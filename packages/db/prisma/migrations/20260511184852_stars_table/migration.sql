-- CreateTable
CREATE TABLE "Stars" (
    "id" SERIAL NOT NULL,
    "submitId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Stars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stars_submitId_userId_key" ON "Stars"("submitId", "userId");

-- AddForeignKey
ALTER TABLE "Stars" ADD CONSTRAINT "Stars_submitId_fkey" FOREIGN KEY ("submitId") REFERENCES "Submit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stars" ADD CONSTRAINT "Stars_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
