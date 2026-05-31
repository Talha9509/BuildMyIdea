

-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "userId",
ADD COLUMN     "receiverId" INTEGER NOT NULL,
ADD COLUMN     "senderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
