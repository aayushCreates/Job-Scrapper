-- AlterTable
ALTER TABLE "LinkedinJobPosts" ALTER COLUMN "postedAt" DROP NOT NULL,
ALTER COLUMN "expiredAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ScrappedJobs" ALTER COLUMN "postedAt" DROP NOT NULL,
ALTER COLUMN "expiredAt" DROP NOT NULL;
