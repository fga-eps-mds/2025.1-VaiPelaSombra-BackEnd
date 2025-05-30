/*
  Warnings:

  - You are about to drop the column `status` on the `Itinerary` table. All the data in the column will be lost.
  - Added the required column `itineraryStatus` to the `Itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Itinerary" DROP COLUMN "status",
ADD COLUMN     "itineraryStatus" VARCHAR(20) NOT NULL;
