import { PrismaClient, ItineraryStatus } from '../src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando tudo...');
  await prisma.review.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.transport.deleteMany();
  await prisma.requiredDocument.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.travelPreference.deleteMany();
  await prisma.travelInterest.deleteMany();
  await prisma.localEvent.deleteMany();
  await prisma.survivalTip.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Criando usuários...');
  const users = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.user.create({
        data: {
          name: `Usuário ${i + 1}`,
          email: `user${i + 1}@teste.com`,
          password: 'senha123',
          profileBio: 'Aventureiro por natureza.',
          profileImage: `https://example.com/avatar${i + 1}.jpg`,
        },
      })
    )
  );

  console.log('🌐 Criando interesses...');
  const interests = await Promise.all(
    ['Praia', 'Montanha', 'Cultura', 'Gastronomia', 'Aventura'].map((label) =>
      prisma.travelInterest.create({ data: { label } })
    )
  );

  console.log('🎯 Preferências por usuário...');
  await Promise.all(
    users.map((user) =>
      prisma.travelPreference.create({
        data: {
          userId: user.id,
          travelInterests: {
            connect: interests.map((i) => ({ id: i.id })),
          },
        },
      })
    )
  );

  console.log('📍 Criando destinos...');
  const destinos = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.destination.create({
        data: {
          title: `Destino ${i + 1}`,
          description: `Descrição do destino ${i + 1}`,
          longitude: `-43.${1000 + i}`,
          latitude: `-22.${900 + i}`,
          localClimate: 'Temperado',
          timeZone: 'GMT-3',
        },
      })
    )
  );

  console.log('🧭 Criando itinerários...');
  const itineraries = await Promise.all(
    users.map((user, i) =>
      prisma.itinerary.create({
        data: {
          title: `Viagem ${i + 1}`,
          startDate: new Date(`2025-12-0${i + 1}`),
          endDate: new Date(`2025-12-1${i + 1}`),
          itineraryStatus: ItineraryStatus.PLANNING,
          lodgingBudget: 1000 + i * 100,
          foodBudget: 300 + i * 50,
          totalBudget: 2000 + i * 200,
          users: { connect: { id: user.id } },
          destinations: { connect: { id: destinos[i % destinos.length].id } },
          createdBy: { connect: { id: user.id } },
        },
      })
    )
  );

  console.log('🚗 Transportes, 🧾 Documentos, 🎯 Atividades...');
  await Promise.all(
    itineraries.flatMap((itinerary, i) => [
      prisma.transport.create({
        data: {
          type: 'Ônibus',
          cost: 150.0 + i * 10,
          itineraryId: itinerary.id,
          description: `Transporte ${i + 1}`,
        },
      }),
      prisma.requiredDocument.create({
        data: {
          content: `Documento necessário ${i + 1}`,
          itineraryId: itinerary.id,
        },
      }),
      prisma.activity.create({
        data: {
          location: `Local ${i + 1}`,
          title: `Atividade ${i + 1}`,
          price: 80 + i * 10,
          startTime: new Date(`2025-12-0${i + 1}T10:00:00Z`),
          endTime: new Date(`2025-12-0${i + 1}T12:00:00Z`),
          description: 'Exploração local',
          itineraryId: itinerary.id,
          destinationId: destinos[i % destinos.length].id,
        },
      }),
    ])
  );

  console.log('📝 Reviews, 🌴 SurvivalTips, 🎉 Eventos...');
  await Promise.all(
    destinos.flatMap((dest, i) => [
      prisma.review.create({
        data: {
          content: `Review do destino ${i + 1}`,
          userId: users[i % users.length].id,
          destinationId: dest.id,
        },
      }),
      prisma.survivalTip.create({
        data: {
          content: `Dica de sobrevivência ${i + 1}`,
          destinationId: dest.id,
        },
      }),
      prisma.localEvent.create({
        data: {
          name: `Evento Local ${i + 1}`,
          destinationId: dest.id,
        },
      }),
    ])
  );

  console.log('✅ Seed finalizado com sucesso 🎉');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
