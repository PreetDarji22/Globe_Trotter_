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
  await prisma.trip.create({
    data: {
      userId: fakeUser.id,
      name: 'Hidden Tokyo Alleyways',
      description: 'A 5-day dive into the underground cafes and off-the-beaten-path shrines of Tokyo.',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 5),
      coverPhoto: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1000',
      isPublic: true
    }
  });

  await prisma.trip.create({
    data: {
      userId: fakeUser2.id,
      name: 'Alps Roadtrip',
      description: 'Driving through the majestic Swiss Alps. Perfect route for summer.',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 7),
      coverPhoto: 'https://images.unsplash.com/photo-1531366936337-77b12fce08f1?auto=format&fit=crop&w=1000',
      isPublic: true
    }
  });

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
