/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName,dateOfBirth]` on the table `authors` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "authors_firstName_lastName_dateOfBirth_key" ON "authors"("firstName", "lastName", "dateOfBirth");
