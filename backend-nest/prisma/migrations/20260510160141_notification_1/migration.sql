/*
  Warnings:

  - Made the column `title` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "title" SET NOT NULL;
