-- AlterTable
ALTER TABLE "LinkedinJobPosts" ALTER COLUMN "batch" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "emailMentioned" DROP NOT NULL,
ALTER COLUMN "phoneMentioned" DROP NOT NULL,
ALTER COLUMN "linkMentioned" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ScrappedJobs" ALTER COLUMN "salary" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "requiredExperience" DROP NOT NULL;
