/*
  Warnings:

  - The `duration` column on the `Transport` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Transport" DROP COLUMN "duration",
ADD COLUMN     "duration" VARCHAR(20);
