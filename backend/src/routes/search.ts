import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

router.get('/cities', async (req, res) => {
  try {
    const { q } = req.query;
    const query = typeof q === 'string' ? q : '';
    
    const cities = await prisma.city.findMany({
      where: query ? {
        name: { contains: query, mode: 'insensitive' }
      } : undefined,
      take: 10
    });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
