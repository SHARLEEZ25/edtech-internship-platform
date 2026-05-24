/*
  Warnings:

  - You are about to drop the column `recruiterEmail` on the `RecruiterProfile` table. All the data in the column will be lost.
  - You are about to drop the column `recruiterName` on the `RecruiterProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RecruiterProfile" DROP COLUMN "recruiterEmail",
DROP COLUMN "recruiterName",
ADD COLUMN     "professionalTitle" TEXT;
