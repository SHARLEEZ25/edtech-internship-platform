-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('CERTIFICATE', 'TROPHY', 'BADGE', 'WORKSHOP');

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "about" TEXT,
ADD COLUMN     "headline" TEXT;

-- CreateTable
CREATE TABLE "StudentExperience" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAchievement" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "description" TEXT,
    "category" "AchievementCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentEngagement" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentExperience_studentId_idx" ON "StudentExperience"("studentId");

-- CreateIndex
CREATE INDEX "StudentAchievement_studentId_idx" ON "StudentAchievement"("studentId");

-- CreateIndex
CREATE INDEX "StudentEngagement_studentId_idx" ON "StudentEngagement"("studentId");

-- AddForeignKey
ALTER TABLE "StudentExperience" ADD CONSTRAINT "StudentExperience_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAchievement" ADD CONSTRAINT "StudentAchievement_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEngagement" ADD CONSTRAINT "StudentEngagement_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
