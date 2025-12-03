/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `LinkedinJobPosts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jobUrl]` on the table `ScrappedJobs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LinkedinJobPosts" DROP COLUMN "expiredAt";

-- CreateIndex
CREATE UNIQUE INDEX "ScrappedJobs_jobUrl_key" ON "ScrappedJobs"("jobUrl");
