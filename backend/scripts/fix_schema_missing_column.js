
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
    try {
        console.log("Attempting to add missing column 'studentsHired' to 'RecruiterProfile'...");

        // Explicitly add the column. 
        // We use "IF NOT EXISTS" to be safe, though Postgres < 9.6 doesn't support it for columns easily in one line without a block.
        // But assuming strict mismatch, we can try ADD COLUMN.
        // If it exists, it will throw, which is fine (means it's already there).

        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "RecruiterProfile" ADD COLUMN "studentsHired" INTEGER NOT NULL DEFAULT 0;`);
            console.log("✅ Should have added 'studentsHired' column.");
        } catch (e) {
            if (e.message.includes("already exists")) {
                console.log("ℹ️ Column 'studentsHired' already exists, skipping.");
            } else {
                throw e;
            }
        }

        console.log("Verifying schema via count query...");
        const count = await prisma.recruiterProfile.count({
            where: {
                studentsHired: { gte: 0 }
            }
        });

        console.log(`✅ Verification Success: RecruiterProfile available. Count: ${count}`);

    } catch (error) {
        console.error("❌ Fix Failed:", error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
