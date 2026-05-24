const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { generateRecommendationDiagnostics } = require("../src/modules/recommendations/recommendations.service");
const { generateStudentEmbedding, generateInternshipEmbedding, cosineSimilarity } = require("../src/modules/recommendations/utils/semanticMatcher.util");

async function debugLeezie() {
    console.log("--- DEBUGGING LEEZIE ---");

    // 1. Find Leezie
    const user = await prisma.user.findFirst({
        where: { fullName: { contains: "Leezie", mode: "insensitive" } },
        include: { studentProfile: { include: { skills: true } } }
    });

    if (!user || !user.studentProfile) {
        console.error("Leezie not found!");
        return;
    }

    const student = user.studentProfile;
    console.log(`Student: ${user.fullName}`);
    console.log(`Headline: ${student.headline}`);
    console.log(`Skills: ${student.skills.map(s => s.name).join(", ")}`);
    console.log(`City: ${student.city}`);

    // 2. Generate Embedding
    console.log("\n--- GENERATING EMBEDDING ---");
    const skillText = student.skills.map(s => s.name).join(" ");
    const studentText = `${student.headline || ""} ${student.specialization || ""} ${skillText} ${student.about || ""}`;
    console.log(`Embedding Text: "${studentText}"`);

    const studentEmbedding = await generateStudentEmbedding(student);

    // 3. Score against specific Targets
    console.log("\n--- SCORING TARGETS ---");

    const targets = await prisma.internship.findMany({
        where: {
            status: "LIVE",
            title: { in: ["Digital Marketing Executive", "React Developer Intern", "Frontend Engineering Intern"] }
        },
        include: { recruiter: true }
    });

    for (const internship of targets) {
        console.log(`\nTesting: ${internship.title} (${internship.internshipType} - ${internship.city})`);
        const internshipEmbedding = await generateInternshipEmbedding(internship);

        const semScore = cosineSimilarity(studentEmbedding, internshipEmbedding);
        console.log(`Semantic Similarity: ${semScore.toFixed(4)}`);

        if (semScore < 0.25) {
            console.log("Result: EXCLUDED (Score < 0.25)");
        } else {
            let finalScore = semScore * 70;

            // Location check
            const isRemote = internship.internshipType === "REMOTE";
            const isCityMatch = (student.city || "").toLowerCase() === (internship.city || "").toLowerCase();

            if (isCityMatch && !isRemote) {
                console.log("Status: Location Bonus Applied (+10)");
                finalScore += 10;
            } else if (!isRemote && !isCityMatch) {
                console.log("Status: EXCLUDED (Location Mismatch)");
            }

            console.log(`Final Calculated Score: ${finalScore.toFixed(2)}`);
        }
    }
}

debugLeezie()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
