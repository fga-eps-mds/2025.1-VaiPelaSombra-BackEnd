/*
  Warnings:

  - You are about to drop the column `createdById` on the `Itinerary` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Itinerary" DROP CONSTRAINT "Itinerary_createdById_fkey";

-- AlterTable
ALTER TABLE "Itinerary" DROP COLUMN "createdById";
