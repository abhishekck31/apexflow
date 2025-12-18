import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const router = Router();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

router.get('/', async (req, res) => {
    const items = await prisma.inventory.findMany();
    res.json(items);
});
// Add this to your existing inventory.routes.ts

router.post('/', async (req, res) => {
    const { sku, name, quantity, status } = req.body;

    try {
        // 1. Enterprise Validation: Prevent duplicate SKUs
        const existingItem = await prisma.inventory.findUnique({
            where: { sku }
        });

        if (existingItem) {
            return res.status(400).json({ error: "SKU already exists in the system." });
        }

        // 2. Create the new asset
        const newItem = await prisma.inventory.create({
            data: {
                sku,
                name,
                quantity: parseInt(quantity) || 0,
                status: status || "OPTIMAL"
            }
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error("Create Inventory Error:", error);
        res.status(500).json({ error: "Internal Server Error during asset creation." });
    }
});

// apps/server/src/routes/inventory.routes.ts

router.patch('/:id/quantity', async (req, res) => {
    const { id } = req.params;
    const { adjustment } = req.body; // e.g., +5 or -2

    try {
        const item = await prisma.inventory.update({
            where: { id },
            data: {
                quantity: {
                    increment: adjustment // Prisma atomic increment
                }
            }
        });
        res.json(item);
    } catch (error) {
        res.status(400).json({ error: "Failed to update quantity. Ensure ID is valid." });
    }
});

export default router;