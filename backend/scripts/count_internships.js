const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function countInternships() {
    try {
        const total = await prisma.internship.count();
        const live = await prisma.internship.count({ where: { status: "LIVE" } });
        const draft = await prisma.internship.count({ where: { status: "DRAFT" } });
        const closed = await prisma.internship.count({ where: { status: "CLOSED" } });

        console.log(`Total Internships: ${total}`);
        console.log(`LIVE: ${live}`);
        console.log(`DRAFT: ${draft}`);
        console.log(`CLOSED: ${closed}`);
    } catch (error) {
        console.error("Error counting internships:", error);
    } finally {
        await prisma.$disconnect();
    }
}

countInternships();
