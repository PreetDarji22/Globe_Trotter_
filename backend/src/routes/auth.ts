import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-hackathon-2026';

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    let user = await prisma.user.findUnique({ where: { email } });
    const passwordHash = await bcrypt.hash(password, 10);

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, firstName: firstName || user.firstName, lastName: lastName || user.lastName }
      });
    } else {
      user = await prisma.user.create({
        data: { firstName: firstName || email.split('@')[0], lastName: lastName || 'User', email, passwordHash },
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, profilePicture: user.profilePicture } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    let user = await prisma.user.findUnique({ where: { email } });
    const passwordHash = await bcrypt.hash(password, 10);

    if (!user) {
      const namePart = (email || 'User').split('@')[0];
      user = await prisma.user.create({
        data: {
          firstName: namePart,
          lastName: 'User',
          email,
          passwordHash
        }
      });
    } else {
      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash }
        });
      }
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, profilePicture: user.profilePicture } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { profilePicture } = req.body;
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { profilePicture }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
