const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    // Create dummy users
    const user1 = await prisma.user.create({
        data: {
            name: 'Alice',
            username: 'alice123',
            email: 'alice@example.com',
            password: 'password123', // Note: In a real application, hash the password
            current_streak: 5,
            longest_streak: 10,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'Bob',
            username: 'bob456',
            email: 'bob@example.com',
            password: 'password456', // Note: In a real application, hash the password
            current_streak: 3,
            longest_streak: 8,
        },
    });

    // Create dummy activities
    await prisma.activity.create({
        data: {
            date: new Date('2023-10-01'),
            description: 'Morning jog',
            user: { connect: { id: user1.id } },
        },
    });

    await prisma.activity.create({
        data: {
            date: new Date('2023-10-02'),
            description: 'Yoga session',
            user: { connect: { id: user1.id } },
        },
    });

    await prisma.activity.create({
        data: {
            date: new Date('2023-10-01'),
            description: 'Cycling',
            user: { connect: { id: user2.id } },
        },
    });

    console.log('Seed data created successfully!');
}

seed()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
