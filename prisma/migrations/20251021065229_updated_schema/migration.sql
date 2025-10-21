/*
  Warnings:

  - You are about to drop the column `allowedYears` on the `ScrappedJobs` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `ScrappedJobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScrappedJobs" DROP COLUMN "allowedYears",
DROP COLUMN "skills",
ADD COLUMN     "allowedBatches" TEXT[];
