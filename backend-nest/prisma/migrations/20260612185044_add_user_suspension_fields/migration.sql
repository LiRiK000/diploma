-- AlterTable
ALTER TABLE "users" ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "isSuspended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "suspendedUntil" TIMESTAMP(3);
