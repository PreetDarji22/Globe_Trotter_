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
  console.log('Seeding fake public trips...');

  // Create a fake user
  const passwordHash = await bcrypt.hash('password123', 10);
  const fakeUser = await prisma.user.upsert({
    where: { email: 'community@explorer.com' },
    update: {},
    create: {
      email: 'community@explorer.com',
      firstName: 'Mia',
      lastName: 'Explorer',
      passwordHash,
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150'
    }
  });

  const fakeUser2 = await prisma.user.upsert({
    where: { email: 'sam@ventures.com' },
    update: {},
    create: {
      email: 'sam@ventures.com',
      firstName: 'Sam',
      lastName: 'Ventures',
      passwordHash,
      profilePicture: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150'
    }
  });

  // Create fake trips
  const trips = [
    {
      userId: fakeUser.id,
      name: 'Hidden Tokyo Alleyways',
      description: 'A 5-day dive into the underground cafes and off-the-beaten-path shrines of Tokyo.',
      coverPhoto: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1000',
    },
    {
      userId: fakeUser2.id,
      name: 'Alps Roadtrip',
      description: 'Driving through the majestic Swiss Alps. Perfect route for summer.',
      coverPhoto: 'https://images.unsplash.com/photo-1531366936337-77b12fce08f1?auto=format&fit=crop&w=1000',
    },
    {
      userId: fakeUser.id,
      name: 'Backpacking Southeast Asia',
      description: 'A month-long journey exploring the incredible street food, temples, and beaches of Vietnam and Thailand.',
      coverPhoto: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1000',
    },
    {
      userId: fakeUser2.id,
      name: 'Classic Europe Rail Tour',
      description: 'The ultimate train hopping experience through France, Italy, and Spain. Essential for first-timers.',
      coverPhoto: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000',
    },
    {
      userId: fakeUser.id,
      name: 'Patagonia Trek',
      description: 'A grueling but rewarding 10-day hike through the pristine wilderness of South America.',
      coverPhoto: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1000',
    },
    {
      userId: fakeUser2.id,
      name: 'NYC Weekend Getaway',
      description: 'How to see the best of the Big Apple in just 48 hours without going bankrupt.',
      coverPhoto: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000',
    },
    {
      userId: fakeUser.id,
      name: 'Bali Retreat',
      description: 'Yoga, relaxation, and exploring the beautiful rice terraces of Ubud.',
      coverPhoto: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000',
    },
    {
      userId: fakeUser2.id,
      name: 'Sahara Desert Expedition',
      description: 'Camping under the stars in the vast dunes of the Sahara.',
      coverPhoto: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1000',
    }
  ];

  await prisma.trip.deleteMany({ where: { isPublic: true } });

  for (const t of trips) {
    await prisma.trip.create({
      data: {
        userId: t.userId,
        name: t.name,
        description: t.description,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 7),
        coverPhoto: t.coverPhoto,
        isPublic: true
      }
    });
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
