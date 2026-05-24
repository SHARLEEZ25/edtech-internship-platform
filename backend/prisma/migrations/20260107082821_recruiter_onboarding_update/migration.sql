/*
  Warnings:

  - The values [RECRUITER_DETAILS,RECRUITER_LOCATION] on the enum `OnboardingStep` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OnboardingStep_new" AS ENUM ('ROLE_SELECTION', 'RECRUITER_PROFESSIONAL', 'RECRUITER_COMPANY', 'RECRUITER_DESCRIPTION', 'STUDENT_EDUCATION', 'STUDENT_SKILLS', 'STUDENT_LOCATION', 'COMPLETED');
ALTER TABLE "User" ALTER COLUMN "onboardingStep" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "onboardingStep" TYPE "OnboardingStep_new" USING ("onboardingStep"::text::"OnboardingStep_new");
ALTER TYPE "OnboardingStep" RENAME TO "OnboardingStep_old";
ALTER TYPE "OnboardingStep_new" RENAME TO "OnboardingStep";
DROP TYPE "OnboardingStep_old";
ALTER TABLE "User" ALTER COLUMN "onboardingStep" SET DEFAULT 'ROLE_SELECTION';
COMMIT;
