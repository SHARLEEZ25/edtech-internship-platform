const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Testing SavedInternship model access...");
        const count = await prisma.savedInternship.count();
        console.log(`✅ Success! SavedInternship model is accessible. Current count: ${count}`);
    } catch (e) {
        console.error("❌ Failed to access SavedInternship model:", e.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
