/*
  Warnings:

  - Added the required column `averageBudget` to the `TravelPreference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `travelFrequency` to the `TravelPreference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `travelerType` to the `TravelPreference` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TravelerType" AS ENUM ('ADVENTURE', 'RELAX', 'CULTURAL', 'NATURE', 'LUXURY');

-- CreateEnum
CREATE TYPE "TravelFrequency" AS ENUM ('RARE', 'OCCASIONAL', 'FREQUENT', 'ALWAYS');

-- AlterTable
ALTER TABLE "TravelPreference" ADD COLUMN     "averageBudget" INTEGER NOT NULL,
ADD COLUMN     "travelFrequency" "TravelFrequency" NOT NULL,
ADD COLUMN     "travelerType" "TravelerType" NOT NULL;
