import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'test-secret-key-for-vitest-32chars!';
process.env.JWT_SECRET = JWT_SECRET;
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
process.env.NODE_ENV = 'test';

vi.mock('../src/prisma', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn()
      },
      trip: {
        count: vi.fn()
      },
      tripStop: {
        count: vi.fn(),
        groupBy: vi.fn()
      },
      activity: {
        count: vi.fn(),
        groupBy: vi.fn()
      },
      city: {
        findMany: vi.fn()
      }
    }
  };
});

import app from '../src/index';
import prisma from '../src/prisma';

describe('Admin Stats Authorization & Aggregates Tests', () => {
  const adminToken = jwt.sign({ id: 'admin-id', email: 'admin@example.com', isAdmin: true }, JWT_SECRET);
  const regularUserToken = jwt.sign({ id: 'regular-user-id', email: 'user@example.com', isAdmin: false }, JWT_SECRET);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/stats', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/admin/stats');
      expect(res.status).toBe(401);
    });

    it('should reject regular user with 403 Forbidden', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({
        id: 'regular-user-id',
        isAdmin: false
      });

      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error', 'Forbidden: Admin access required');
    });

    it('should allow admin user to access stats and return real aggregates', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({
        id: 'admin-id',
        isAdmin: true
      });
      (prisma.user.count as any).mockResolvedValue(10);
      (prisma.trip.count as any).mockResolvedValue(25);
      (prisma.tripStop.count as any).mockResolvedValue(50);
      (prisma.activity.count as any).mockResolvedValue(100);
      (prisma.user.findMany as any).mockResolvedValue([
        { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', isAdmin: false, createdAt: new Date() }
      ]);
      (prisma.tripStop.groupBy as any).mockResolvedValue([]);
      (prisma.city.findMany as any).mockResolvedValue([]);
      (prisma.activity.groupBy as any).mockResolvedValue([]);

      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalUsers', 10);
      expect(res.body).toHaveProperty('totalTrips', 25);
      expect(res.body).toHaveProperty('totalStops', 50);
      expect(res.body).toHaveProperty('totalActivities', 100);
      expect(res.body).toHaveProperty('users');
      expect(res.body).toHaveProperty('topCities');
      expect(res.body).toHaveProperty('topActivities');
      expect(res.body).toHaveProperty('trendData');
      expect(res.body).toHaveProperty('revenueData');
    });
  });
});
