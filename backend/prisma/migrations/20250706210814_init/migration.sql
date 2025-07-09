/*
  Warnings:

  - Added the required column `createdById` to the `Itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ItineraryComment" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "itineraryId" INTEGER NOT NULL,

    CONSTRAINT "ItineraryComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryComment" ADD CONSTRAINT "ItineraryComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryComment" ADD CONSTRAINT "ItineraryComment_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
