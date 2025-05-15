-- CreateEnum
CREATE TYPE "TravelerType" AS ENUM ('AVENTUREIRO', 'CULTURAL', 'RELAXAMENTO', 'GASTRONOMICO');

-- CreateEnum
CREATE TYPE "TravelFrequency" AS ENUM ('BIMESTRAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL');

-- CreateTable
CREATE TABLE "TravelPreferences" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "travelerType" "TravelerType" NOT NULL,
    "travelFrequency" "TravelFrequency" NOT NULL,
    "averageBudget" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TravelPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileBio" TEXT,
    "profileImage" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelInterests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TravelInterests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prefer" (
    "travelPreferencesId" INTEGER NOT NULL,
    "travelInterestsId" INTEGER NOT NULL,

    CONSTRAINT "Prefer_pkey" PRIMARY KEY ("travelPreferencesId","travelInterestsId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "TravelPreferences" ADD CONSTRAINT "TravelPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prefer" ADD CONSTRAINT "Prefer_travelPreferencesId_fkey" FOREIGN KEY ("travelPreferencesId") REFERENCES "TravelPreferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prefer" ADD CONSTRAINT "Prefer_travelInterestsId_fkey" FOREIGN KEY ("travelInterestsId") REFERENCES "TravelInterests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
