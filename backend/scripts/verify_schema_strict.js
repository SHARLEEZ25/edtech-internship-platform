
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
    try {
        console.log("Verifying RecruiterProfile schema...");

        // Attempt to select from the RecruiterProfile table directly.
        // Even if no records exist, this forces the DB to validate the column existence in the SELECT clause.
        const count = await prisma.recruiterProfile.count({
            where: {
                studentsHired: { gte: 0 } // This condition FORCES the column to be used in the WHERE clause
            }
        });

        console.log(`✅ Success: RecruiterProfile table queried successfully. Count: ${count}`);
    } catch (error) {
        console.error("❌ Verification Failed:", error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
