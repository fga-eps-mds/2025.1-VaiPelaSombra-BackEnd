-- CreateTable
CREATE TABLE "PlanoViagem" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "destino" TEXT,
    "dataInicio" TIMESTAMP(3),
    "dataFim" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanoViagem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlanoViagem" ADD CONSTRAINT "PlanoViagem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
