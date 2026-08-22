import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.post('/trips/:tripId/stops', async (req: AuthRequest, res) => {
  try {
    const { cityId, startDate, endDate, orderIndex } = req.body;
    
    const trip = await prisma.trip.findUnique({ where: { id: req.params.tripId } });
    if (!trip || trip.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const stop = await prisma.tripStop.create({
      data: {
        tripId: req.params.tripId,
        cityId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        orderIndex
      },
      include: { city: true }
    });
    res.status(201).json(stop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add stop' });
  }
});

router.delete('/stops/:stopId', async (req: AuthRequest, res) => {
  try {
    const stop = await prisma.tripStop.findUnique({ 
      where: { id: req.params.stopId },
      include: { trip: true }
    });
    if (!stop || stop.trip.userId !== req.user!.id) return res.status(403).json({ error: 'Forbidden' });

    await prisma.tripStop.delete({ where: { id: req.params.stopId } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete stop' });
  }
});

router.post('/stops/:stopId/activities', async (req: AuthRequest, res) => {
  try {
    const { name, title, category, activityType, startTime, durationMinutes, estimatedCost, cost, description } = req.body;
    
    const stop = await prisma.tripStop.findUnique({ 
      where: { id: req.params.stopId },
      include: { trip: true }
    });
    if (!stop || stop.trip.userId !== req.user!.id) return res.status(403).json({ error: 'Forbidden' });

    const actName = name || title || 'Activity';
    const actCategory = category || activityType || 'Sightseeing';
    const actCost = estimatedCost !== undefined ? Number(estimatedCost) : (cost !== undefined ? Number(cost) : 0);
    const actDuration = durationMinutes ? Number(durationMinutes) : 60;
    const actStart = startTime ? new Date(startTime) : new Date();

    const activity = await prisma.activity.create({
      data: {
        tripStopId: req.params.stopId,
        name: actName,
        category: actCategory,
        startTime: actStart,
        durationMinutes: actDuration,
        estimatedCost: actCost,
        description: description || ''
      }
    });
    res.status(201).json(activity);
  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
});
