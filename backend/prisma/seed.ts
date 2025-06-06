import { PrismaClient } from '../src/generated/prisma'; // FIX

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding de dados...');

  const paris = await prisma.destination.upsert({
    where: { name: 'Paris' },
    update: {},
    create: {
      name: 'Paris',
      description: 'A cidade da luz e do amor, famosa por sua arte, moda, gastronomia e cultura.',
      mainImageUrl: 'https://images.unsplash.com/photo-1502602898669-e74fec47310d?fit=crop&w=800&q=80', // Exemplo de URL de imagem
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1549144577-486111f148b3?fit=crop&w=600&q=80', description: 'Torre Eiffel' },
          { url: 'https://images.unsplash.com/photo-1590779033379-335607590d98?fit=crop&w=600&q=80', description: 'Museu do Louvre' },
        ],
      },
    },
  });

  const rio = await prisma.destination.upsert({
    where: { name: 'Rio de Janeiro' },
    update: {},
    create: {
      name: 'Rio de Janeiro',
      description: 'A Cidade Maravilhosa, conhecida por suas praias deslumbrantes, carnaval e o Cristo Redentor.',
      mainImageUrl: 'https://images.unsplash.com/photo-1516339901601-2e52b62b719f?fit=crop&w=800&q=80', // Exemplo de URL de imagem
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1518632611729-1662580ce6a8?fit=crop&w=600&q=80', description: 'Cristo Redentor' },
          { url: 'https://images.unsplash.com/photo-1579730533355-6677f240ef40?fit=crop&w=600&q=80', description: 'Praia de Copacabana' },
        ],
      },
    },
  });

  console.log(`Seeding concluído. Destinos criados: ${paris.name}, ${rio.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });