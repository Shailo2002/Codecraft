-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "frameId" TEXT NOT NULL DEFAULT 'temp';

-- AlterTable
ALTER TABLE "Frame" ADD COLUMN     "designCode" TEXT NOT NULL DEFAULT 'temp';

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Frame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
