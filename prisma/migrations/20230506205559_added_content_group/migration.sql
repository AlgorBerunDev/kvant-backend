/*
  Warnings:

  - Added the required column `type` to the `ContentImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ContentText` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContentImage" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ContentText" ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ContentGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentableGroupId" INTEGER NOT NULL,
    "contentableGroupType" TEXT NOT NULL,

    CONSTRAINT "ContentGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentGroup_name_key" ON "ContentGroup"("name");

-- AddForeignKey
ALTER TABLE "ContentGroup" ADD CONSTRAINT "image_contentableId" FOREIGN KEY ("contentableGroupId") REFERENCES "ContentImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentGroup" ADD CONSTRAINT "text_contentableId" FOREIGN KEY ("contentableGroupId") REFERENCES "ContentText"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
