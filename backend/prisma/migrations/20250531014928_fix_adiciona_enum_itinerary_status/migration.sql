/*
  Warnings:

  - Changed the type of `itineraryStatus` on the `Itinerary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ItineraryStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Itinerary" DROP COLUMN "itineraryStatus",
ADD COLUMN     "itineraryStatus" "ItineraryStatus" NOT NULL;
