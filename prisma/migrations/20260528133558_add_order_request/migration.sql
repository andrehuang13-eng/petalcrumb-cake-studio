-- CreateEnum
CREATE TYPE "OrderRequestStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'DECLINED', 'COMPLETED');

-- CreateTable
CREATE TABLE "order_requests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "eventDate" DATE NOT NULL,
    "servings" INTEGER NOT NULL,
    "occasion" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "allergenNotes" TEXT,
    "budgetRange" TEXT,
    "referenceCakeId" TEXT,
    "status" "OrderRequestStatus" NOT NULL DEFAULT 'NEW',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_requests_status_idx" ON "order_requests"("status");

-- CreateIndex
CREATE INDEX "order_requests_createdAt_idx" ON "order_requests"("createdAt");

-- CreateIndex
CREATE INDEX "order_requests_referenceCakeId_idx" ON "order_requests"("referenceCakeId");

-- AddForeignKey
ALTER TABLE "order_requests" ADD CONSTRAINT "order_requests_referenceCakeId_fkey" FOREIGN KEY ("referenceCakeId") REFERENCES "cakes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
