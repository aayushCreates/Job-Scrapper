-- CreateTable
CREATE TABLE "ScrappedJobs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredSkills" TEXT[],
    "allowedYears" TEXT[],
    "allowedBranches" TEXT[],
    "salary" TEXT NOT NULL,
    "jobUrl" TEXT NOT NULL,
    "skills" TEXT[],
    "location" TEXT NOT NULL,
    "requiredExperience" TEXT NOT NULL,
    "postPlatform" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrappedJobs_pkey" PRIMARY KEY ("id")
);
