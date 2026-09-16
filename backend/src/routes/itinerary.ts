import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();
router.use(authenticateToken);

const addStopSchema = z.object({
  cityId: z.string().min(1, 'cityId is required'),
  startDate: z.string().datetime().or(z.string().min(4)),
  endDate: z.string().datetime().or(z.string().min(4)),
  orderIndex: z.number().int().default(0)
});

const addActivitySchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  category: z.string().optional(),
  activityType: z.string().optional(),
  startTime: z.string().optional(),
  durationMinutes: z.number().optional().default(60),
  estimatedCost: z.number().or(z.string()).optional(),
  cost: z.number().or(z.string()).optional(),
  description: z.string().optional().nullable()
});

router.post('/trips/:tripId/stops', validateBody(addStopSchema), async (req: AuthRequest, res: Response) => {
  try {
    const tripId = req.params.tripId as string;
    const { cityId, startDate, endDate, orderIndex } = req.body;
    
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    if (trip.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this trip' });
    }

    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      return res.status(400).json({ error: 'Invalid cityId provided' });
    }

    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        orderIndex: orderIndex !== undefined ? orderIndex : 0
      },
      include: { city: true }
    });
    return res.status(201).json(stop);
  } catch (error) {
    console.error('Add stop error:', error);
    return res.status(500).json({ error: 'Failed to add stop' });
  }
});

router.delete('/stops/:stopId', async (req: AuthRequest, res: Response) => {
  try {
    const stopId = req.params.stopId as string;
    const stop = await prisma.tripStop.findUnique({ 
      where: { id: stopId },
      include: { trip: true }
    }) as any;

    if (!stop) return res.status(404).json({ error: 'Stop not found' });
    if (stop.trip.userId !== req.user!.id) return res.status(403).json({ error: 'Forbidden: You do not own this trip' });

    // Cascade delete activities
    await prisma.activity.deleteMany({ where: { tripStopId: stopId } });
    await prisma.tripStop.delete({ where: { id: stopId } });
    return res.json({ success: true, message: 'Stop deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete stop' });
  }
});

router.post('/stops/:stopId/activities', validateBody(addActivitySchema), async (req: AuthRequest, res: Response) => {
  try {
    const stopId = req.params.stopId as string;
    const { name, title, category, activityType, startTime, durationMinutes, estimatedCost, cost, description } = req.body;
    
    const stop = await prisma.tripStop.findUnique({ 
      where: { id: stopId },
      include: { trip: true }
    }) as any;

    if (!stop) return res.status(404).json({ error: 'Stop not found' });
    if (stop.trip.userId !== req.user!.id) return res.status(403).json({ error: 'Forbidden: You do not own this trip' });

    const actName = name || title || 'Activity';
    const actCategory = category || activityType || 'Sightseeing';
    const actCost = estimatedCost !== undefined ? Number(estimatedCost) : (cost !== undefined ? Number(cost) : 0);
    const actDuration = durationMinutes ? Number(durationMinutes) : 60;
    const actStart = startTime ? new Date(startTime) : new Date();

    const activity = await prisma.activity.create({
      data: {
        tripStopId: stopId,
        name: actName,
        category: actCategory,
        startTime: actStart,
        durationMinutes: actDuration,
        estimatedCost: actCost,
        description: description || ''
      }
    });
    return res.status(201).json(activity);
  } catch (error) {
    console.error('Add activity error:', error);
    return res.status(500).json({ error: 'Failed to add activity' });
  }
});

router.delete('/activities/:activityId', async (req: AuthRequest, res: Response) => {
  try {
    const activityId = req.params.activityId as string;
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { tripStop: { include: { trip: true } } }
    }) as any;

    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    if (activity.tripStop.trip.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this activity' });
    }

    await prisma.activity.delete({ where: { id: activityId } });
    return res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete activity' });
  }
});

export default router;


