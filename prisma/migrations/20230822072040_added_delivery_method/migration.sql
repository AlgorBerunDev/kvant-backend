/*
  Warnings:

  - You are about to drop the column `deliveryType` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryType",
ADD COLUMN     "deliveryMethod" INTEGER NOT NULL DEFAULT 0;
