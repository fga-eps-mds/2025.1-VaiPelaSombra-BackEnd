-- CreateTable
CREATE TABLE "DestinationImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "destinationId" INTEGER,

    CONSTRAINT "DestinationImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DestinationImage" ADD CONSTRAINT "DestinationImage_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;
