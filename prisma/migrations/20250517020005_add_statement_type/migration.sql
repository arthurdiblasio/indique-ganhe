-- CreateEnum
CREATE TYPE "StatementType" AS ENUM ('CREDIT', 'DEBIT');

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Statement" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "StatementType" NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Statement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
