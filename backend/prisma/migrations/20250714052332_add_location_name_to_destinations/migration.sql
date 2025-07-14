/*
  Warnings:

  - Added the required column `locationName` to the `Destination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "locationName" VARCHAR(100) NOT NULL;
