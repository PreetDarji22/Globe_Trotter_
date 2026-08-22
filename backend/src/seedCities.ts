import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding cities...');

  const cities = [
    { name: 'Paris', country: 'France', costIndex: '$$$', popularityScore: 98, imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f' },
    { name: 'Tokyo', country: 'Japan', costIndex: '$$$', popularityScore: 99, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf' },
    { name: 'Rome', country: 'Italy', costIndex: '$$', popularityScore: 95, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5' },
    { name: 'Bali', country: 'Indonesia', costIndex: '$', popularityScore: 92, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' },
    { name: 'New York', country: 'USA', costIndex: '$$$$', popularityScore: 97, imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9' },
    { name: 'Bangkok', country: 'Thailand', costIndex: '$', popularityScore: 90, imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365' },
    { name: 'London', country: 'UK', costIndex: '$$$$', popularityScore: 96, imageUrl: 'https://images.unsplash.com/photo-1513635269975-5969336cdac0' },
    { name: 'Barcelona', country: 'Spain', costIndex: '$$', popularityScore: 93, imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded' }
  ];

  for (const c of cities) {
    await prisma.city.create({ data: c });
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
