import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, description, startDate, endDate, coverPhoto, isPublic } = req.body;
    const trip = await prisma.trip.create({
      data: {
        userId: req.user!.id,
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        coverPhoto,
        isPublic: isPublic === true
      }
    });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user!.id },
      orderBy: { startDate: 'asc' }
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: {
        stops: {
          include: {
            city: true,
            activities: true
          },
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
    
    if (!trip || (trip.userId !== req.user!.id && !trip.isPublic)) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

export default router;
