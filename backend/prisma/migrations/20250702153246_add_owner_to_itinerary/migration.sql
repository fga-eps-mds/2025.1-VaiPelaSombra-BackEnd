/*
  Warnings:

  - You are about to drop the `_ItineraryToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ItineraryToUser" DROP CONSTRAINT "_ItineraryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItineraryToUser" DROP CONSTRAINT "_ItineraryToUser_B_fkey";

-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ItineraryToUser";

-- CreateTable
CREATE TABLE "_ItineraryParticipants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ItineraryParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ItineraryParticipants_B_index" ON "_ItineraryParticipants"("B");

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItineraryParticipants" ADD CONSTRAINT "_ItineraryParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItineraryParticipants" ADD CONSTRAINT "_ItineraryParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
