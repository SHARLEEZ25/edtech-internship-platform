-- CreateEnum
CREATE TYPE "EngagementStatus" AS ENUM ('UPCOMING', 'COMPLETED');

-- AlterTable
ALTER TABLE "RecruiterProfile" ADD COLUMN     "activePostings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hiringRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "retentionRate" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "studentsHired" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "twitterUrl" TEXT,
ADD COLUMN     "yearsOfExperience" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "specialization" TEXT;

-- CreateTable
CREATE TABLE "RecruiterAchievement" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "colorClass" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecruiterAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruiterEngagement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "status" "EngagementStatus" NOT NULL DEFAULT 'UPCOMING',
    "icon" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecruiterEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedInternship" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "internshipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedInternship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedInternship_studentId_idx" ON "SavedInternship"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedInternship_studentId_internshipId_key" ON "SavedInternship"("studentId", "internshipId");

-- AddForeignKey
ALTER TABLE "RecruiterAchievement" ADD CONSTRAINT "RecruiterAchievement_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "RecruiterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruiterEngagement" ADD CONSTRAINT "RecruiterEngagement_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "RecruiterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedInternship" ADD CONSTRAINT "SavedInternship_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedInternship" ADD CONSTRAINT "SavedInternship_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE CASCADE ON UPDATE CASCADE;
