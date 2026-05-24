
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
    try {
        console.log("Verifying RecruiterProfile schema...");

        // We don't need a real user, we just want to see if the query throws a "column not found" error.
        // However, finding a non-existent user is the safest way to test the query structure without needing actual data.
        // If the column doesn't exist, Prisma will throw BEFORE returning null.

        await prisma.user.findFirst({
            where: { email: "test_verification_non_existent@example.com" },
            include: {
                recruiterProfile: {
                    select: {
                        studentsHired: true, // This is the column that was missing
                    }
                }
            }
        });

        console.log("✅ Success: Query executed without 'column not found' error.");
    } catch (error) {
        console.error("❌ Verification Failed:", error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
