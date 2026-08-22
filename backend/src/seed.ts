import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with default cities...');

  const cities = [
    { name: 'Tokyo', country: 'Japan', costIndex: '$$$', popularityScore: 98, imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26' },
    { name: 'Paris', country: 'France', costIndex: '$$$$', popularityScore: 95, imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'New York', country: 'USA', costIndex: '$$$$', popularityScore: 92, imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9' },
    { name: 'Rome', country: 'Italy', costIndex: '$$', popularityScore: 94, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5' },
    { name: 'Bali', country: 'Indonesia', costIndex: '$', popularityScore: 89, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' }
  ];

  for (const city of cities) {
    await prisma.city.create({ data: city });
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
