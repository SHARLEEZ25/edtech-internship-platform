const { generateStudentEmbedding, generateInternshipEmbedding, cosineSimilarity, getEmbedding } = require("../src/modules/recommendations/utils/semanticMatcher.util");

async function debugMechanical() {
    console.log("--- DEBUGGING MECHANICAL ENGINEERING ANOMALY ---");

    // 1. Simulate Leezie's Profile (Headline x 5)
    const student = {
        headline: "full stack developer",
        specialization: "computer science and engineering",
        skills: [{ name: "python" }, { name: "ui/ux design" }, { name: "digital marketing" }, { name: "Rust" }],
        about: "this is a example about me"
    };

    const studentHeadline = "full stack developer";
    // Replicating the 5x logic from semanticMatcher.util.js
    const studentText = `${studentHeadline} ${studentHeadline} ${studentHeadline} ${studentHeadline} ${studentHeadline} ${student.specialization} ${student.skills.map(s => s.name).join(" ")} ${student.about}`;

    console.log("Student Text Preview:", studentText.substring(0, 100) + "...");
    const studentVec = await getEmbedding(studentText);

    // 2. Simulate Mechanical Internship
    // generateInternshipEmbedding uses: title + domain + skills
    const mechanicalInternship = {
        title: "Mechanical Engineering Intern",
        domain: "Engineering",
        skills: ["AutoCAD", "Thermodynamics"]
    };
    const mechText = `${mechanicalInternship.title} ${mechanicalInternship.domain} ${mechanicalInternship.skills.join(" ")}`;
    console.log("Internship Text:", mechText);
    const mechVec = await getEmbedding(mechText);

    // 3. Calculate Score
    const score = cosineSimilarity(studentVec, mechVec);
    console.log(`\nSemantic Score: ${score.toFixed(4)}`);

    // 4. Simulate Filter Logic
    const THRESHOLD = 0.25;
    if (score < THRESHOLD) {
        console.log(`Result: BLOCKED (Score < ${THRESHOLD})`);
    } else {
        console.log(`Result: PASSED (Score >= ${THRESHOLD})`);

        let totalScore = score * 70;
        console.log(`Base Points: ${totalScore.toFixed(2)}`);

        // Location Bonus Simulation
        console.log("Adding Location Bonus (+10)...");
        totalScore += 10;
        console.log(`Total Score with Bonus: ${totalScore.toFixed(2)}`);
    }
}

debugMechanical();
