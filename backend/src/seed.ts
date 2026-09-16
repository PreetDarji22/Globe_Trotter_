import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Error: DATABASE_URL is required to run seed script.');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Admin User
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@globetrotter.com' },
    update: { isAdmin: true },
    create: {
      email: 'admin@globetrotter.com',
      firstName: 'Admin',
      lastName: 'System',
      passwordHash: adminPasswordHash,
      isAdmin: true,
      profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300'
    }
  });
  console.log(`👤 Admin user ready: ${adminUser.email}`);

  // 2. Seed Demo User
  const demoPasswordHash = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'mia.chen@globe.com' },
    update: {},
    create: {
      email: 'mia.chen@globe.com',
      firstName: 'Mia',
      lastName: 'Chen',
      passwordHash: demoPasswordHash,
      isAdmin: false,
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300'
    }
  });
  console.log(`👤 Demo user ready: ${demoUser.email}`);

  // 3. Seed Cities
  const citiesData = [
    { name: 'Tokyo', country: 'Japan', costIndex: '$$$', popularityScore: 99, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800' },
    { name: 'Paris', country: 'France', costIndex: '$$$$', popularityScore: 98, imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800' },
    { name: 'Rome', country: 'Italy', costIndex: '$$', popularityScore: 95, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800' },
    { name: 'Bali', country: 'Indonesia', costIndex: '$', popularityScore: 92, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800' },
    { name: 'New York', country: 'USA', costIndex: '$$$$', popularityScore: 96, imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800' },
    { name: 'Bangkok', country: 'Thailand', costIndex: '$', popularityScore: 90, imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800' },
    { name: 'London', country: 'UK', costIndex: '$$$$', popularityScore: 97, imageUrl: 'https://images.unsplash.com/photo-1513635269975-5969336cdac0?auto=format&fit=crop&w=800' },
    { name: 'Barcelona', country: 'Spain', costIndex: '$$', popularityScore: 94, imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800' }
  ];

  const cityMap = new Map<string, string>();
  for (const c of citiesData) {
    const existing = await prisma.city.findFirst({ where: { name: c.name } });
    if (!existing) {
      const created = await prisma.city.create({ data: c });
      cityMap.set(c.name, created.id);
    } else {
      cityMap.set(c.name, existing.id);
    }
  }
  console.log(`🗺️ Seeded ${citiesData.length} global destination cities.`);

  // 4. Seed Community Trips & Itineraries
  const tokyoId = cityMap.get('Tokyo') || (await prisma.city.findFirst())?.id!;
  const parisId = cityMap.get('Paris') || (await prisma.city.findFirst())?.id!;
  const romeId = cityMap.get('Rome') || (await prisma.city.findFirst())?.id!;
  const baliId = cityMap.get('Bali') || (await prisma.city.findFirst())?.id!;

  const existingTripsCount = await prisma.trip.count({ where: { isPublic: true } });
  if (existingTripsCount === 0) {
    // Trip 1: Japan Highlights
    const trip1 = await prisma.trip.create({
      data: {
        userId: demoUser.id,
        name: 'Tokyo & Kyoto Zen Adventure',
        description: 'A 7-day immersive journey through ancient shrines, bustling neon markets, and Mount Fuji vistas.',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 7),
        coverPhoto: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000',
        isPublic: true,
        stops: {
          create: [
            {
              cityId: tokyoId,
              startDate: new Date(),
              endDate: new Date(Date.now() + 86400000 * 4),
              orderIndex: 0,
              activities: {
                create: [
                  {
                    name: 'Skytree & Asakusa Walking Tour',
                    category: 'Sightseeing',
                    startTime: new Date(),
                    durationMinutes: 180,
                    estimatedCost: 45,
                    description: 'Panoramic Tokyo views and historic Senso-ji temple stroll.'
                  },
                  {
                    name: 'Tsukiji Market Sushi Tasting',
                    category: 'Food',
                    startTime: new Date(),
                    durationMinutes: 120,
                    estimatedCost: 120,
                    description: 'Fresh omakase sushi and street food tour.'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    // Trip 2: European Grand Explorer
    await prisma.trip.create({
      data: {
        userId: demoUser.id,
        name: 'Paris Romance & Roman Antiquities',
        description: 'From the summit of the Eiffel Tower to the Roman Colosseum and authentic pasta dining.',
        startDate: new Date(Date.now() + 86400000 * 14),
        endDate: new Date(Date.now() + 86400000 * 24),
        coverPhoto: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1000',
        isPublic: true,
        stops: {
          create: [
            {
              cityId: parisId,
              startDate: new Date(Date.now() + 86400000 * 14),
              endDate: new Date(Date.now() + 86400000 * 19),
              orderIndex: 0,
              activities: {
                create: [
                  {
                    name: 'Louvre Museum Guided Pass',
                    category: 'Sightseeing',
                    startTime: new Date(),
                    durationMinutes: 150,
                    estimatedCost: 65,
                    description: 'Masterpieces of world art with skip-the-line access.'
                  }
                ]
              }
            },
            {
              cityId: romeId,
              startDate: new Date(Date.now() + 86400000 * 19),
              endDate: new Date(Date.now() + 86400000 * 24),
              orderIndex: 1,
              activities: {
                create: [
                  {
                    name: 'Colosseum Underground Tour',
                    category: 'Culture',
                    startTime: new Date(),
                    durationMinutes: 120,
                    estimatedCost: 80,
                    description: 'Explore the gladiators arena and subterranean tunnels.'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    console.log('✨ Seeded sample community itineraries.');
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

