/*
  Warnings:

  - You are about to drop the column `status` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "status",
ADD COLUMN     "resize" JSONB;
