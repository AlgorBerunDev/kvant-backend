-- CreateTable
CREATE TABLE "ContentData" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "data" JSONB[],
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentData_key_key" ON "ContentData"("key");

-- AddForeignKey
ALTER TABLE "ContentGroup" ADD CONSTRAINT "data_contentableId" FOREIGN KEY ("contentableGroupId") REFERENCES "ContentData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
