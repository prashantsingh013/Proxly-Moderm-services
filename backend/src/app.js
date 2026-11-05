import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';
import trustScoreRoutes from './routes/trustScoreRoutes.js';
import smartMatchRoutes from './routes/smartMatchRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import aiClassifyRoutes from './routes/aiClassifyRoutes.js';
import predictiveCareRoutes from './routes/predictiveCareRoutes.js';
import endorsementRoutes from './routes/endorsementRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiting
app.use('/api', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'SkillBridge API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/trustscore', trustScoreRoutes);
app.use('/api/matches', smartMatchRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/classify', aiClassifyRoutes);
app.use('/api/predictiveCare', predictiveCareRoutes);
app.use('/api/endorsements', endorsementRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
