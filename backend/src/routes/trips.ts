import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();
router.use(authenticateToken);

const createTripSchema = z.object({
  name: z.string().min(1, 'Trip name is required').max(100),
  description: z.string().max(1000).optional().nullable(),
  startDate: z.string().datetime().or(z.string().min(4)),
  endDate: z.string().datetime().or(z.string().min(4)),
  coverPhoto: z.string().url().optional().nullable().or(z.literal('')),
  isPublic: z.boolean().optional().default(false)
});

const updateTripSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional().nullable(),
  startDate: z.string().datetime().or(z.string().min(4)).optional(),
  endDate: z.string().datetime().or(z.string().min(4)).optional(),
  coverPhoto: z.string().url().optional().nullable().or(z.literal('')),
  isPublic: z.boolean().optional()
});

router.post('/', validateBody(createTripSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, startDate, endDate, coverPhoto, isPublic } = req.body;
    const trip = await prisma.trip.create({
      data: {
        userId: req.user!.id,
        name,
        description: description || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        coverPhoto: coverPhoto || null,
        isPublic: isPublic === true
      }
    });
    return res.status(201).json(trip);
  } catch (error) {
    console.error('Trip creation error:', error);
    return res.status(500).json({ error: 'Failed to create trip' });
  }
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user!.id },
      orderBy: { startDate: 'asc' }
    });
    return res.json(trips);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.id as string;
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
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
    
    return res.json(trip);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

router.put('/:id', validateBody(updateTripSchema), async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.id as string;
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId }
    });

    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (existingTrip.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this trip' });
    }

    const { name, description, startDate, endDate, coverPhoto, isPublic } = req.body;
    const updated = await prisma.trip.update({
      where: { id: tripId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(coverPhoto !== undefined && { coverPhoto }),
        ...(isPublic !== undefined && { isPublic })
      }
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update trip' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.id as string;
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { stops: { select: { id: true } } }
    });

    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (existingTrip.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this trip' });
    }

    const stopIds = existingTrip.stops.map((s: { id: string }) => s.id);
    if (stopIds.length > 0) {
      await prisma.activity.deleteMany({
        where: { tripStopId: { in: stopIds } }
      });
      await prisma.tripStop.deleteMany({
        where: { tripId }
      });
    }
    await prisma.like.deleteMany({ where: { tripId } });
    await prisma.comment.deleteMany({ where: { tripId } });
    await prisma.trip.delete({ where: { id: tripId } });

    return res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    return res.status(500).json({ error: 'Failed to delete trip' });
  }
});

export default router;


