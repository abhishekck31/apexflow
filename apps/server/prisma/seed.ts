// apps/server/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
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
    console.log('🚀 Seeding Database...');

    // 1. Create a Default Admin User
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.upsert({
        where: { email: 'admin@apexflow.com' },
        update: {},
        create: {
            email: 'admin@apexflow.com',
            password: hashedAdminPassword,
            role: 'ADMIN',
        },
    });

    console.log('👤 Admin User Seeded.');

    // 2. Create a Default Staff User
    const hashedStaffPassword = await bcrypt.hash('staff123', 10);

    await prisma.user.upsert({
        where: { email: 'staff@apexflow.com' },
        update: {},
        create: {
            email: 'staff@apexflow.com',
            password: hashedStaffPassword,
            role: 'STAFF',
        },
    });

    console.log('👥 Staff User Seeded.');

    console.log('📦 Seeding Inventory...');

    const products = [
        { sku: 'APX-001', name: 'Hydraulic Pump X1', quantity: 45, status: 'OPTIMAL' },
        { sku: 'APX-002', name: 'Industrial Sensor S4', quantity: 12, status: 'LOW STOCK' },
        { sku: 'APX-003', name: 'Control Valve v9', quantity: 0, status: 'OUT OF STOCK' },
        { sku: 'APX-004', name: 'Fiber Optic Cable 50m', quantity: 89, status: 'OPTIMAL' },
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
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
