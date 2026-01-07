/*
  Warnings:

  - Added the required column `description` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "publishedDate" TIMESTAMP(3),
ADD COLUMN     "publisher" TEXT,
ADD COLUMN     "subjects" TEXT[];

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_BookRecommendations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookRecommendations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BookRecommendations_B_index" ON "_BookRecommendations"("B");

-- AddForeignKey
ALTER TABLE "_BookRecommendations" ADD CONSTRAINT "_BookRecommendations_A_fkey" FOREIGN KEY ("A") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookRecommendations" ADD CONSTRAINT "_BookRecommendations_B_fkey" FOREIGN KEY ("B") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
