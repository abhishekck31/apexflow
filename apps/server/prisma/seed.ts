// apps/server/prisma/seed.ts
import { PrismaClient } from '../src/generated/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize the pool and adapter
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Pass the adapter to the client
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🚀 Seeding Enterprise Roles...');

    // 1. Create Roles (Standard for Salesforce/Airbus architecture)
    const adminRole = await prisma.role.upsert({
        where: { name: 'Admin' },
        update: {},
        create: {
            name: 'Admin',
            permissions: { all: true, delete: true },
        },
    });

    const managerRole = await prisma.role.upsert({
        where: { name: 'Manager' },
        update: {},
        create: {
            name: 'Manager',
            permissions: { edit: true, view: true },
        },
    });

    // 2. Create a Default Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.upsert({
        where: { email: 'admin@apexflow.com' },
        update: {},
        create: {
            email: 'admin@apexflow.com',
            password_hash: hashedPassword,
            roleId: adminRole.id,
        },
    });


    console.log('📦 Seeding Inventory...');

    const products = [
        { sku: 'APX-001', name: 'Hydraulic Pump X1', quantity: 45, status: 'In Stock' },
        { sku: 'APX-002', name: 'Industrial Sensor S4', quantity: 12, status: 'Low Stock' },
        { sku: 'APX-003', name: 'Control Valve v9', quantity: 0, status: 'Out of Stock' },
        { sku: 'APX-004', name: 'Fiber Optic Cable 50m', quantity: 89, status: 'In Stock' },
    ];

    for (const item of products) {
        await prisma.inventory.upsert({
            where: { sku: item.sku },
            update: {},
            create: item,
        });
    }

    console.log('✅ Inventory Seeded.');

    console.log('✅ Database Seeded: You can now log in with admin@apexflow.com / admin123');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());