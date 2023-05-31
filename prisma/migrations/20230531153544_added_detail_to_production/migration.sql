/*
  Warnings:

  - Added the required column `detail` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "detail" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UsersOnFavouriteProducts" (
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersOnFavouriteProducts_pkey" PRIMARY KEY ("productId","userId")
);

-- CreateTable
CREATE TABLE "UsersOnRateProducts" (
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersOnRateProducts_pkey" PRIMARY KEY ("productId","userId")
);

-- AddForeignKey
ALTER TABLE "UsersOnFavouriteProducts" ADD CONSTRAINT "UsersOnFavouriteProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnFavouriteProducts" ADD CONSTRAINT "UsersOnFavouriteProducts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnRateProducts" ADD CONSTRAINT "UsersOnRateProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnRateProducts" ADD CONSTRAINT "UsersOnRateProducts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
