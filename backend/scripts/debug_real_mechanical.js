const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { generateStudentEmbedding, generateInternshipEmbedding, cosineSimilarity } = require("../src/modules/recommendations/utils/semanticMatcher.util");

async function debugRealMechanical() {
    console.log("--- DEBUGGING REAL DB RECORD ---");

    // 1. Get Leezie
    const user = await prisma.user.findFirst({
        where: { fullName: { contains: "Leezie", mode: "insensitive" } },
        include: { studentProfile: { include: { skills: true } } }
    });
    if (!user) { console.log("Leezie not found"); return; }
    const student = user.studentProfile;

    const studentEmbedding = await generateStudentEmbedding(student);

    // 2. Get the specific Mechanical Internship shown in UI
    const internship = await prisma.internship.findFirst({
        where: {
            title: { contains: "Mechanical", mode: "insensitive" },
            status: "LIVE"
        },
        include: { recruiter: true }
    });

    if (!internship) {
        console.log("No LIVE 'Mechanical' internship found in DB!");
        return;
    }

    console.log(`\nFound Internship: ${internship.title}`);
    console.log(`Company: ${internship.recruiter.companyName}`);
    console.log(`Skills: ${internship.skills}`);
    console.log(`Domain: ${internship.domain}`);
    console.log(`Description: ${internship.description}`);

    // 3. Generate Embedding & Score
    const internshipEmbedding = await generateInternshipEmbedding(internship);
    const score = cosineSimilarity(studentEmbedding, internshipEmbedding);

    console.log(`\nREAL Semantic Score: ${score.toFixed(4)}`);

    if (score < 0.25) {
        console.log("Verdict: SHOULD BE BLOCKED.");
    } else {
        console.log("Verdict: PASSES FILTER (Why?? Check text content).");
    }
}

debugRealMechanical()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
