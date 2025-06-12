import { PrismaClient } from '../src/generated/prisma'; // Ajuste o caminho se necessário

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding de dados...');

  const paris = await prisma.destination.upsert({
    where: { name: 'Paris' },
    update: {},
    create: {
      name: 'Paris',
      description: 'A cidade da luz e do amor, famosa por sua arte, moda, gastronomia e cultura.',
      mainImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg',
      images: {
        create: [
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg',
            description: 'Torre Eiffel (vista clássica)',
          },
          {
            url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?fit=crop&w=800&q=80',
            description: 'Vista aérea de Paris',
          },
        ],
      },
    },
  });

  const rio = await prisma.destination.upsert({
    where: { name: 'Rio de Janeiro' },
    update: {},
    create: {
      name: 'Rio de Janeiro',
      description: 'A Cidade Maravilhosa, conhecida por suas praias, carnaval e o Cristo Redentor.',
      mainImageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?fit=crop&w=800&q=80',
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?fit=crop&w=800&q=80',
            description: 'Imagem de Cristo Redentor',
          },
        ],
      },
    },
  });

  const brasilia = await prisma.destination.upsert({
    where: { name: 'Brasília' },
    update: {},
    create: {
      name: 'Brasília',
      description: 'A capital do Brasil, famosa por sua arquitetura moderna e planejamento urbano.',
      mainImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg',
      images: {
        create: [
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg',
            description: 'Imagem simbólica de Brasília (temporária)',
          },
        ],
      },
    },
  });

  console.log(
    `Seeding concluído. Destinos criados: ${paris.name}, ${rio.name}, ${brasilia.name}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
