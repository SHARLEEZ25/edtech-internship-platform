const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const recommendationService = require("../src/modules/recommendations/recommendations.service");

async function verifyRecommendations() {
    try {
        console.log("--- STARTING VERIFICATION ---");

        // 1. Identify a test student
        // We'll grab the first student user found
        const studentUser = await prisma.user.findFirst({
            where: { role: "STUDENT" },
            include: { studentProfile: { include: { skills: true } } }
        });

        if (!studentUser || !studentUser.studentProfile) {
            console.error("No student profile found for testing. Please seed data.");
            return;
        }

        const studentId = studentUser.id;
        console.log(`Testing for Student: ${studentUser.email} (ID: ${studentId})`);
        console.log(`Skills: ${studentUser.studentProfile.skills.map(s => s.name).join(", ")}`);
        console.log(`City: ${studentUser.studentProfile.city}`);

        // 2. Run Recommendations
        const result = await recommendationService.generateRecommendations(studentId);

        // 3. Log Results
        console.log("\n--- HIGHLIGHTED (Most Likely) ---");
        if (result.highlighted) {
            console.log(`Title: ${result.highlighted.title}`);
            console.log(`Company: ${result.highlighted.recruiter?.companyName}`);
            console.log(`Reason: ${result.highlighted.reason}`);
            console.log(`Score: ${result.highlighted.score.toFixed(2)} (Semantic Match: ${result.highlighted.semanticMatch ? result.highlighted.semanticMatch.toFixed(2) : 'N/A'})`);
        } else {
            console.log("None");
        }

        console.log("\n--- TOP LIST ---");
        result.list.forEach((item, index) => {
            console.log(`#${index + 1}: ${item.title} (${item.recruiter?.companyName}) - Score: ${item.score.toFixed(2)}`);
            console.log(`    Reasons: ${item.reasons.join(", ")}`);
        });

        console.log("\n--- VERIFICATION COMPLETE ---");

    } catch (error) {
        console.error("Verification Attempt Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyRecommendations();
