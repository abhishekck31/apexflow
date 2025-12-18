import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// 1. Setup the connection pool
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Initialize the adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the PrismaClient [Prisma 7 Requirement]
const prisma = new PrismaClient({ adapter });

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true }
        });

        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        // 2. Check password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

        // 3. Generate JWT (This is the "ID Card" for the frontend)
        const token = jwt.sign(
            { userId: user.id, role: user.role.name },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '8h' }
        );

        res.json({ token, user: { email: user.email, role: user.role.name } });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};