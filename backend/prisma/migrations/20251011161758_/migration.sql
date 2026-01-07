-- CreateTable
CREATE TABLE "_ReadBooks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ReadBooks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ReadBooks_B_index" ON "_ReadBooks"("B");

-- AddForeignKey
ALTER TABLE "_ReadBooks" ADD CONSTRAINT "_ReadBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadBooks" ADD CONSTRAINT "_ReadBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
