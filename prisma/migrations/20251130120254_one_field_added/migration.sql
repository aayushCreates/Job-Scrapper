/*
  Warnings:

  - Added the required column `isDeadlineGiven` to the `ScrappedJobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScrappedJobs" ADD COLUMN     "isDeadlineGiven" BOOLEAN NOT NULL;
