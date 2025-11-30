/*
  Warnings:

  - Made the column `batch` on table `LinkedinJobPosts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `LinkedinJobPosts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailMentioned` on table `LinkedinJobPosts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneMentioned` on table `LinkedinJobPosts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `linkMentioned` on table `LinkedinJobPosts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `salary` on table `ScrappedJobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `ScrappedJobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `requiredExperience` on table `ScrappedJobs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LinkedinJobPosts" ALTER COLUMN "batch" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "emailMentioned" SET NOT NULL,
ALTER COLUMN "phoneMentioned" SET NOT NULL,
ALTER COLUMN "linkMentioned" SET NOT NULL;

-- AlterTable
ALTER TABLE "ScrappedJobs" ALTER COLUMN "salary" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "requiredExperience" SET NOT NULL;
