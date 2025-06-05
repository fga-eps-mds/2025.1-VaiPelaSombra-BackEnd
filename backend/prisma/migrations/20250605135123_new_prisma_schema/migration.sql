/*
  Warnings:

  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `profileBio` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `profileImage` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the `PlanoViagem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prefer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TravelInterests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TravelPreferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ItineraryStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "PlanoViagem" DROP CONSTRAINT "PlanoViagem_userId_fkey";

-- DropForeignKey
ALTER TABLE "Prefer" DROP CONSTRAINT "Prefer_travelInterestsId_fkey";

-- DropForeignKey
ALTER TABLE "Prefer" DROP CONSTRAINT "Prefer_travelPreferencesId_fkey";

-- DropForeignKey
ALTER TABLE "TravelPreferences" DROP CONSTRAINT "TravelPreferences_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "profileBio" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "profileImage" SET DATA TYPE VARCHAR(500);

-- DropTable
DROP TABLE "PlanoViagem";

-- DropTable
DROP TABLE "Prefer";

-- DropTable
DROP TABLE "TravelInterests";

-- DropTable
DROP TABLE "TravelPreferences";

-- DropEnum
DROP TYPE "TravelFrequency";

-- DropEnum
DROP TYPE "TravelerType";

-- CreateTable
CREATE TABLE "TravelPreference" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TravelPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelInterest" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "TravelInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Itinerary" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "itineraryStatus" "ItineraryStatus" NOT NULL,
    "lodgingBudget" DECIMAL(7,2),
    "foodBudget" DECIMAL(7,2),
    "totalBudget" DECIMAL(7,2),

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequiredDocument" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(800) NOT NULL,
    "itineraryId" INTEGER NOT NULL,

    CONSTRAINT "RequiredDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transport" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "cost" DECIMAL(6,2) NOT NULL,
    "departure" TIMESTAMP(3),
    "arrival" TIMESTAMP(3),
    "duration" TIMESTAMP(3),
    "description" VARCHAR(500),
    "itineraryId" INTEGER NOT NULL,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "longitude" VARCHAR(100) NOT NULL,
    "latitude" VARCHAR(100) NOT NULL,
    "localClimate" VARCHAR(500),
    "timeZone" VARCHAR(100),

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(1500) NOT NULL,
    "imageUrl" VARCHAR(500),
    "userId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "price" DECIMAL(5,2),
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" TEXT,
    "description" VARCHAR(500),
    "itineraryId" INTEGER NOT NULL,
    "destinationId" INTEGER,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalEvent" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "destinationId" INTEGER NOT NULL,

    CONSTRAINT "LocalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurvivalTip" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(500) NOT NULL,
    "destinationId" INTEGER NOT NULL,

    CONSTRAINT "SurvivalTip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TravelInterestToTravelPreference" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TravelInterestToTravelPreference_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ItineraryToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ItineraryToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DestinationToItinerary" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DestinationToItinerary_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "TravelPreference_userId_key" ON "TravelPreference"("userId");

-- CreateIndex
CREATE INDEX "_TravelInterestToTravelPreference_B_index" ON "_TravelInterestToTravelPreference"("B");

-- CreateIndex
CREATE INDEX "_ItineraryToUser_B_index" ON "_ItineraryToUser"("B");

-- CreateIndex
CREATE INDEX "_DestinationToItinerary_B_index" ON "_DestinationToItinerary"("B");

-- AddForeignKey
ALTER TABLE "TravelPreference" ADD CONSTRAINT "TravelPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequiredDocument" ADD CONSTRAINT "RequiredDocument_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalEvent" ADD CONSTRAINT "LocalEvent_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurvivalTip" ADD CONSTRAINT "SurvivalTip_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TravelInterestToTravelPreference" ADD CONSTRAINT "_TravelInterestToTravelPreference_A_fkey" FOREIGN KEY ("A") REFERENCES "TravelInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TravelInterestToTravelPreference" ADD CONSTRAINT "_TravelInterestToTravelPreference_B_fkey" FOREIGN KEY ("B") REFERENCES "TravelPreference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItineraryToUser" ADD CONSTRAINT "_ItineraryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItineraryToUser" ADD CONSTRAINT "_ItineraryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DestinationToItinerary" ADD CONSTRAINT "_DestinationToItinerary_A_fkey" FOREIGN KEY ("A") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DestinationToItinerary" ADD CONSTRAINT "_DestinationToItinerary_B_fkey" FOREIGN KEY ("B") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
