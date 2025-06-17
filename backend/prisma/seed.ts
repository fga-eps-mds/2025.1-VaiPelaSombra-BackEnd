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
      mainImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Brasilia_National_Congress_Buildings.jpg',
      images: {
        create: [
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Brasilia_National_Congress_Buildings.jpg',
            description: 'Imagem simbólica de Brasília (temporária)',
          },
        ],
      },
    },
  });

  const roma = await prisma.destination.upsert({
    where: { name: 'Roma' },
    update: {},
    create: {
      name: 'Roma',
      description: 'A capital do Itália, famosa por sua cultura milenar e arquitetura fascinante.',
      mainImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Sant%27Angelo_bridge%2C_dusk%2C_Rome%2C_Italy.jpg',
      images: {
        create: [
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Sant%27Angelo_bridge%2C_dusk%2C_Rome%2C_Italy.jpg',
            description: 'Imagem simbólica de Roma (temporária)',
          },
        ],
      },
    },
  });

  const londres = await prisma.destination.upsert({
    where: { name: 'Londres' },
    update: {},
    create: {
      name: 'Londres',
      description: 'A capital da Inglaterra, famosa por sua história e grandes conquistas',
      mainImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Palace_of_Westminster%2C_London_-_Feb_2007.jpg',
      images: {
        create: [
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Palace_of_Westminster%2C_London_-_Feb_2007.jpg',
            description: 'Imagem simbólica de Londres (temporária)',
          },
        ],
      },
    },
  });

  const tokio = await prisma.destination.upsert({
      where: { name: 'Tokio' },
      update: {},
      create: {
        name: 'Tokio',
        description: 'A capital do Japão, famoso por sua tecnolgia e educaão',
        mainImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Skyscrapers_of_Shinjuku_2009_January_%28revised%29.jpg',
        images: {
          create: [
            {
              url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Skyscrapers_of_Shinjuku_2009_January_%28revised%29.jpg',
              description: 'Imagem simbólica de Tokio (temporária)',
            },
          ],
        },
      },
    });

    const buenosaires = await prisma.destination.upsert({
      where: { name: 'Buenos Aires' },
      update: {},
      create: {
        name: 'Buenos Aires',
        description: 'A capital da Argentina, famosa por sua culinária e cultura',
        mainImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Casa_Rosada%2C_Buenos_Aires%2C_Argentina.jpg',
        images: {
          create: [
            {
              url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Casa_Rosada%2C_Buenos_Aires%2C_Argentina.jpg',
              description: 'Imagem simbólica de Buenos Aires (temporária)',
            },
          ],
        },
      },
    });

    const buenosaires = await prisma.destination.upsert({
      where: { name: 'Buenos Aires' },
      update: {},
      create: {
        name: 'Buenos Aires',
        description: 'A capital da Argentina, famosa por sua culinária e cultura',
        mainImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Casa_Rosada%2C_Buenos_Aires%2C_Argentina.jpg',
        images: {
          create: [
            {
              url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Casa_Rosada%2C_Buenos_Aires%2C_Argentina.jpg',
              description: 'Imagem simbólica de Buenos Aires (temporária)',
            },
          ],
        },
      },
    });

    const gramado = await prisma.destination.upsert({
      where: { name: 'Gramado' },
      update: {},
      create: {
        name: 'Gramado',
        description: 'Uma cidade romântica, famosa por sua culinária e paisagens',
        mainImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Gramado_RS_2022.jpg',
        images: {
          create: [
            {
              url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Gramado_RS_2022.jpg',
              description: 'Imagem simbólica de Gramado (temporária)',
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
