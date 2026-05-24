const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testSoftDelete() {
    console.log("Starting Soft Delete Verification...");

    try {
        // 1. Find a recruiter to act as
        const recruiter = await prisma.recruiterProfile.findFirst({
            include: { user: true }
        });

        if (!recruiter) {
            console.error("No recruiter found for testing. Please run full onboarding first.");
            return;
        }

        console.log(`Testing with Recruiter: ${recruiter.companyName} (${recruiter.userId})`);

        // 2. Create a test internship
        const internship = await prisma.internship.create({
            data: {
                recruiterId: recruiter.id,
                title: "Test Soft Delete Internship",
                description: "This should be hidden after deletion",
                domain: "Engineering",
                internshipType: "REMOTE",
                workType: "FULL_TIME",
                status: "LIVE",
                durationValue: 3,
                durationUnit: "MONTHS",
                openings: 5,
                applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            }
        });

        console.log(`Created internship: ${internship.id}`);

        // 3. Verify it appears in search results
        const listBefore = await prisma.internship.findMany({
            where: { id: internship.id, deletedAt: null }
        });
        console.log(`Appeurs in search before delete? ${listBefore.length === 1 ? "YES" : "NO"}`);

        if (listBefore.length === 0) throw new Error("Internship failed to appear initially");

        // 4. Perform Soft Delete (simulating service call)
        await prisma.internship.update({
            where: { id: internship.id },
            data: { deletedAt: new Date() }
        });
        console.log("Performed soft delete.");

        // 5. Verify it DOES NOT appear in search results
        const listAfter = await prisma.internship.findMany({
            where: { id: internship.id, deletedAt: null }
        });
        console.log(`Appeurs in search after delete? ${listAfter.length === 0 ? "NO" : "YES"}`);

        if (listAfter.length > 0) throw new Error("Internship still appears in search after soft delete!");

        // 6. Verify it still exists in DB
        const rawCheck = await prisma.internship.findUnique({
            where: { id: internship.id }
        });
        console.log(`Still exists in database? ${rawCheck ? "YES" : "NO"}`);
        console.log(`deletedAt value: ${rawCheck.deletedAt}`);

        if (!rawCheck.deletedAt) throw new Error("deletedAt was not set properly!");

        // Cleanup
        await prisma.internship.delete({ where: { id: internship.id } });
        console.log("Cleaned up test internship.");

        console.log("\n✅ Soft Delete Verification Passed!");

    } catch (error) {
        console.error("\n❌ Verification Failed:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testSoftDelete();
