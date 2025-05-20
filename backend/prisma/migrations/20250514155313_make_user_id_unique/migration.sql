/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `TravelPreferences` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TravelPreferences_userId_key" ON "TravelPreferences"("userId");
