const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking for 'specialization' field in StudentProfile model...");
        const result = await prisma.studentProfile.findFirst({
            select: { specialization: true }
        });
        console.log("✅ Success! 'specialization' field is accessible in Prisma Client.");
    } catch (e) {
        console.error("❌ Failed to access 'specialization' field:", e.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
