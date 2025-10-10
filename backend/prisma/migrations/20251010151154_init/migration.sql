/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `genres` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "genres_value_key" ON "genres"("value");
