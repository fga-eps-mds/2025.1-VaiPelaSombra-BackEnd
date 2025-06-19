/*
  Warnings:

  - Changed the type of `longitude` on the `Destination` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `latitude` on the `Destination` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "longitude",
ADD COLUMN     "longitude" DECIMAL(9,6) NOT NULL,
DROP COLUMN "latitude",
ADD COLUMN     "latitude" DECIMAL(9,6) NOT NULL;
