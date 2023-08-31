-- AlterTable
ALTER TABLE "OrderDetail" ADD COLUMN     "priceWithDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "priceWithoutDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
