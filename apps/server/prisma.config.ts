// apps/server/prisma.config.ts
import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Explicitly load the .env file from the current directory
dotenv.config();

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Now this will correctly resolve the variable
    url: process.env.DATABASE_URL,
  },
});