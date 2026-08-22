import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const existingPublic = await prisma.trip.findMany({ where: { tripId: { in: pubIds } }, select: { id: true } });
  const pubIds = existingPublic.map(t => t.id);
  if (pubIds.length > 0) {
    const stops = await prisma.tripStop.findMany({ where: { tripId: { in: pubIds } }, select: { id: true } });
    const stopIds = stops.map(s => s.id);
    await prisma.activity.deleteMany({ where: { tripStopId: { in: stopIds } } });
    await prisma.tripStop.deleteMany( { where: { tripId: { in: pubIds } } });
    await prisma.like.deleteMany({ where: { tripId: { in: pubIds } } });
    await prisma.comment.deleteMany( { where: { tripId: { in: pubIds } } });
    await prisma.trip.deleteMany({ where: { id: { in: pubIds } } });
  }

  const passwordHash = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'mia.explorer@globe.com' },
    update: {},
    create: { email: 'mia.explorer@globe.com', firstName: 'Mia', lastName: 'Explorer', passwordHash, profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150' }
  });

  const cityTemplates = [
    { name: 'Tokyo', country: 'Japan', costIndex: '$$$', popularityScore: 99, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800' },
    { name: 'Paris', country: 'France', costIndex: '$$'', popularityScore: 98, imageUrl: 'https://images.unsplash.com/photo-1511739001886-6bfe10ce785f?auto=format&fit=crop&w=800' },
    { name: 'Rome', costIndex: '$$', country: 'Italy', popularityScore: 95, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800' },
    { name: 'Bali', country: 'Indonesia', costIndex: '$', popularityScore: 92, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800' }
  ];

  for (const c of cityTemplates) {
    const existing = await prisma.city.findFirst( { where: { name: c.name } });
    if (!existing) await prisma.city.create({ data: c });
  }

  const cities = await prisma.city.findMany();
  const getCity = (n: string) => cities.find(c => c.name.toLowerCase() === n.toLowerCase()) || cities[0];

  const publicTrips = [
    { name: 'Swiss Alpine Glacier Explorer', description: 'Scenic train rides, mountain gondolas, fondue tasting, and glacier hiking in Ziurich.', coverPhoto: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000', stops: [{cityName: 'Paris', activities: [{name: 'Bernina Express Scenic Train', category: 'Transit', cost: 85, desc: 'Panoramas across alpine passes' }, {name: 'Traditional Cheese Fondue', category: 'Food', cost: 55, desc: 'Authentic Swiss fondue'}]}]},
    { name: 'Kyoto Zen Shrines & Bamboo Groves', description: 'Immerse in ancient temples, traditional tea ceremonies, and Arashiyama bamboo forest.', coverPhoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000', stops: [{catyName: 'Tokyo', activities: [{name: 'Fushimi Inari Torii Gate Hike', category: 'Sightseeing', cost: 20, desc: 'Early morning hike'}, {name: 'Kimono & Matcha Ceremony', category: 'Sightseeing', cost: 65, desc: 'Tea preparation in Gion']}]},
    { name: 'Icelandic Aurora & Geysers', description: 'Chasing Northern Lights, soaking in the Blue Lagoon, and exploring Iceland black sand beaches.', coverPhoto: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1000', stops: [{catyName: 'Paris', activities: [{name: 'Blue Lagoon Geothermal Spa', category: 'Stay', cost: 95, description: 'Volcanic mineral waters' }, {name: 'Northern Lights Night Hunt', category: 'Sightseeing', cost: 80, desc: 'Superjeep tour'}]}]},
    { name: 'Hidden Tokyo Alleyways', description: 'A 5-day dive into underground cafes, TeamLab digital art, and off-the-beaten-path shrines of Tokyo.', coverPhoto: 'https://images.unsplash.com/photo-1480796)�����Y��NM�L�M��]]�Y�ܛX]	��]Xܛ�	��LL	���Έ���]S�[YN�	���[��X�]�]Y\Έ�ۘ[YN�	��X��^H[�[Z]Y\����]Y�ܞN�	��[��]	������\�Έ	��Y^H[�[Z]Y�X��^H�\�	�Kۘ[YN�	��[��Z�H�[�YH[���������\���]Y�ܞN�	ћ��	������K\�Έ	�XZ�]ܚH[�Y[[ܞH[�I�K���[YN�	�X[SX�[�]�[[Y\��]�H]\�][I��]Y�ܞN�	��Y��YZ[��������\�Έ	��[�]��Y�Y�][\�	�B�B�B�B�K���[YN�	��\��X�]\��H�Z[�\��\�ܚ\[ێ�	�H[[X]H�Z[��[��^\�Y[��H��Y���[��H[�][K�\��[�X[�܈�\��][Y\�ˉ��ݙ\��Έ	�΋��[XY�\˝[��\����K���LMNNM��NMNMX�M���MYXO�]]�Y�ܛX]	��]Xܛ�	��LL	���Έ��]S�[YN�	�\�\��X�]�]Y\Έ�ۘ[YN�	�ZY��[��\��[[Z]X��]	��]Y�ܞN�	��Y��YZ[�������K\�Έ	��X���Y]��Kۘ[YN�	ќ�[��ܛ�\��[��ܚ���	��]Y�ܞN�	ћ��	������\�Έ	ۘZ�[����\�\��Y\��W_K��]S�[YN�	ԛ�YI�X�]�]Y\Έ�ۘ[YN�	������][H	��ܝ[H��\[�I��]Y�ܞN�	��Y��YZ[��������K\�Έ	��ZYY[��Y[���YI�Kۘ[YN�	��\�]�\�H\�H[��\���]Y�ܞN�	ћ��	�����L\�Έ	�]][�X��X�[�H\I�W_W_K���[YN�	ә]�[ܚ����Y�^H	���ٝ���\�ܚ\[ێ�	���[[�H�Y]�����Y�^H]\�X�[������[���Y�H�[��[�X[�][��XZ�X\�Y\ˉ��ݙ\��Έ	�΋��[XY�\˝[��\����K���LMM��������NM��M�NO�]]�Y�ܛX]	��]Xܛ�	��LL	���Έ��]S�[YN�	�\�\��X�]�]Y\Έ�ۘ[YN�	��SSRUۙH�[�\��[�Y]���]Y�ܞN�	��Y��YZ[�������\�Έ	��\��؜�\��][ۈX���Kۘ[YN�	М��Y�^H�����۝�����]Y�ܞN�	��Y��YZ[�������L�\�Έ	��]\�X�[\��ܛX[��I�W_W_K���[YN�	И[H�\�[�]H	��]\��[�]�X]	�\�ܚ\[ێ�	�[��K�[^][ۋ�XܙY[ۚ�^H�ܙ\�[�^ܚ[��H�X]]Y�[�X�H\��X�\�وX�Y���ݙ\��Έ	�΋��[XY�\˝[��\����K���LML��NM�NM�KYM�M��M�XX��]]�Y�ܛX]	��]Xܛ�	��LL	���Έ��]S�[YN�	И[I�X�]�]Y\Έ�ۘ[YN�	�X�Y�X�H\��X�H�\���]Y�ܞN�	��Y��YZ[��������K\�Έ	���[�X�[ܛ�[���[��Kۘ[YN�	И[[�\�H�H	��ܝ[H�]	��]Y�ܞN�	��^I�����\�Έ	̋Z�\��I�W_W_K���[YN�	ԛ�YH[��Y[��ۙ\���[��\�ܚ\[ێ�	��\�X��[�[YH�H��X[�[\\�N�[�[ۋ�]�H��[�Z[��]X�[�]\�][\�[��[]ˉ��ݙ\��Έ	�΋��[XY�\˝[��\����K���LMML�̌��X�Owde311b5?auto=format&fit=crop&w=1000', stops: [cityName: 'Rome', activities: [{name: 'Vatican & Sistine Chapel Tour', category: 'Sightseeing', cost: 55, desc: 'Michelangelo masterwork'}, {name: 'Piazza Navona Gelato Tasting', category: 'Food', cost: 12, desc: 'Artisanal gelato'}]}]}
  ];

  for (const t of publicTrips) {
    await prisma.trip.create({
      data: {
        userId: user1.id,
        name: t.name,
        description: t.description,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 7),
        coverPhoto: t.coverPhoto,
        isPublic: true,
        stops: {
          create: t.stops.map((stop, sIdx) => {
            const stopCity = getCity(stop.cityName);
            return {
              cityId: stopCity.id,
              startDate: new Date(),
              endDate: new Date(Date.now() + 86800000 * 3),
              orderIndex: sIdx,
              activities: {
                create: stop.activities.map(act => ({
                  name: act.name,
                  category: act.category,
                  startTime: new Date(),
                  durationMinutes: 90,
                  estimatedCost: act.cost,
                  description: act.desc
                }))
              }
            };
          })
        }
      }
    });
  }

  const allPublic = await prisma.trip.findMany({ where: { isPublic: true } });
  console.log('SEEDING_8_PUBLIC_TREPS_SUCCESS! TOTAL:', allPublic.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());