-- CreateEnum
CREATE TYPE "InternshipType" AS ENUM ('REMOTE', 'ONSITE', 'HYBRID');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('FULL_TIME', 'PART_TIME');

-- CreateEnum
CREATE TYPE "InternshipStatus" AS ENUM ('DRAFT', 'LIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'SELECTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "Internship" (
    "id" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "internshipType" "InternshipType" NOT NULL,
    "workType" "WorkType" NOT NULL DEFAULT 'FULL_TIME',
    "status" "InternshipStatus" NOT NULL DEFAULT 'DRAFT',
    "city" TEXT,
    "state" TEXT,
    "stipendMin" INTEGER,
    "stipendMax" INTEGER,
    "stipendCurrency" TEXT NOT NULL DEFAULT 'INR',
    "stipendPeriod" TEXT NOT NULL DEFAULT 'MONTH',
    "durationValue" INTEGER NOT NULL,
    "durationUnit" TEXT NOT NULL,
    "openings" INTEGER NOT NULL,
    "skills" TEXT[],
    "requirements" TEXT[],
    "responsibilities" TEXT[],
    "applicationDeadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Internship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternshipApplication" (
    "id" TEXT NOT NULL,
    "internshipId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "resumeUrl" TEXT NOT NULL,
    "coverLetter" TEXT,
    "portfolioUrl" TEXT,
    "githubUrl" TEXT,
    "linkedinUrl" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "withdrawnAt" TIMESTAMP(3),

    CONSTRAINT "InternshipApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationStatusHistory" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fromStatus" "ApplicationStatus",
    "toStatus" "ApplicationStatus" NOT NULL,
    "changedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Internship_recruiterId_idx" ON "Internship"("recruiterId");

-- CreateIndex
CREATE INDEX "Internship_status_idx" ON "Internship"("status");

-- CreateIndex
CREATE INDEX "Internship_domain_idx" ON "Internship"("domain");

-- CreateIndex
CREATE INDEX "InternshipApplication_internshipId_idx" ON "InternshipApplication"("internshipId");

-- CreateIndex
CREATE INDEX "InternshipApplication_studentId_idx" ON "InternshipApplication"("studentId");

-- CreateIndex
CREATE INDEX "InternshipApplication_status_idx" ON "InternshipApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InternshipApplication_internshipId_studentId_key" ON "InternshipApplication"("internshipId", "studentId");

-- CreateIndex
CREATE INDEX "ApplicationStatusHistory_applicationId_idx" ON "ApplicationStatusHistory"("applicationId");

-- AddForeignKey
ALTER TABLE "Internship" ADD CONSTRAINT "Internship_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "RecruiterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipApplication" ADD CONSTRAINT "InternshipApplication_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipApplication" ADD CONSTRAINT "InternshipApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStatusHistory" ADD CONSTRAINT "ApplicationStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "InternshipApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
