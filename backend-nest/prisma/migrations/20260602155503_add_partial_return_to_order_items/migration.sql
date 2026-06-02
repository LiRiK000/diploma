-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "isReturned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "returnDate" TIMESTAMP(3);
