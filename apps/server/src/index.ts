import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Initialize with the adapter as required by Prisma 7
export const prisma = new PrismaClient({ adapter });

const app = express();

// 1. Middlewares (Must come BEFORE routes)
app.use(cors());
app.use(express.json());

// 2. Base Route (To verify the server is working)
app.get('/', (req, res) => {
    res.send('<h1>ApexFlow API is Online</h1><p>Visit /health for status.</p>');
});

// 3. Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'ApexFlow Server is Active',
        timestamp: new Date().toISOString()
    });
});

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
  🚀 ApexFlow Server Started
  📡 URL: http://localhost:${PORT}
  🏥 Health: http://localhost:${PORT}/health
  🔐 Auth: http://localhost:${PORT}/api/auth/login
  `);
});