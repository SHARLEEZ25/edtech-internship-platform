-- AlterTable
ALTER TABLE "Internship" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Internship_deletedAt_idx" ON "Internship"("deletedAt");
