import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma';
import { authenticateToken, AuthRequest, getJwtSecret } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  profilePicture: z.string().url().optional().or(z.literal(''))
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required')
});

const profileSchema = z.object({
  profilePicture: z.string().url('Must be a valid URL')
});

router.post('/register', validateBody(registerSchema), async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, profilePicture } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        profilePicture: profilePicture || null,
        isAdmin: false
      }
    });

    const jwtSecret = getJwtSecret();
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

router.post('/login', validateBody(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const jwtSecret = getJwtSecret();
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        isAdmin: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

router.put('/profile', authenticateToken, validateBody(profileSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { profilePicture } = req.body;
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { profilePicture }
    });
    return res.json({ success: true, profilePicture });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;

