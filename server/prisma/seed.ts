import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const password = await bcrypt.hash('password123', 10);

    // 1. Create Tenant
    const tenant = await prisma.tenant.upsert({
        where: { domain: 'localhost' },
        update: {},
        create: {
            name: 'Default Tenant',
            domain: 'localhost',
        },
    });

    console.log('Created tenant:', tenant.id);

    // 2. Create Users
    const users = [
        { username: 'owner', role: 'OWNER' },
        { username: 'admin', role: 'ADMIN' },
        { username: 'agent', role: 'AGENT' },
        { username: 'testuser', role: 'USER' },
    ];

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { username: u.username },
            update: {},
            create: {
                username: u.username,
                password,
                role: u.role as any,
                tenantId: tenant.id,
                wallet: {
                    create: {
                        balance: 10000,
                        currency: 'BDT',
                    },
                },
            },
        });
        console.log(`Created user: ${u.username} (${u.role})`);
    }

    // 3. Create Hierarchy (Agent -> User)
    const agent = await prisma.user.findUnique({ where: { username: 'agent' } });
    const user = await prisma.user.findUnique({ where: { username: 'testuser' } });

    if (agent && user) {
        // Check if link exists
        const existingLink = await prisma.userHierarchy.findFirst({
            where: { descendantId: user.id, ancestorId: agent.id },
        });

        if (!existingLink) {
            // Create simple parent-child link (depth 1)
            await prisma.userHierarchy.create({
                data: {
                    ancestorId: agent.id,
                    descendantId: user.id,
                    depth: 1,
                }
            });
            // Set parentId on user
            await prisma.user.update({
                where: { id: user.id },
                data: { parentId: agent.id }
            });
            console.log('Linked Agent -> User');
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
