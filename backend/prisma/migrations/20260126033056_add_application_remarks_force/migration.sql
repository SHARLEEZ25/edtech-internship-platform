-- CreateTable
CREATE TABLE "ApplicationRemark" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationRemark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApplicationRemark_applicationId_idx" ON "ApplicationRemark"("applicationId");

-- AddForeignKey
ALTER TABLE "ApplicationRemark" ADD CONSTRAINT "ApplicationRemark_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "InternshipApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
