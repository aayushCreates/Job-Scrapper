/*
  Warnings:

  - Added the required column `expiredAt` to the `ScrappedJobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScrappedJobs" ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "LinkedinJobPosts" (
    "id" TEXT NOT NULL,
    "postedPerson" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "emailMentioned" TEXT NOT NULL,
    "phoneMentioned" TEXT NOT NULL,
    "linkMentioned" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkedinJobPosts_pkey" PRIMARY KEY ("id")
);
