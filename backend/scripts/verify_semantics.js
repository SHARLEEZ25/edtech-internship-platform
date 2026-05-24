const { getEmbedding, cosineSimilarity } = require("../src/modules/recommendations/utils/semanticMatcher.util");

async function testSemantics() {
    console.log("--- TESTING SEMANTIC MATCHER V2 ---");

    const textA = "Frontend Developer React JavaScript";
    const textB = "UI Engineer with React.js experience"; // Similar
    const textC = "Marketing Intern Sales"; // Different

    console.log(`Generating embedding for: "${textA}"...`);
    const start = Date.now();
    const vecA = await getEmbedding(textA);
    const timeA = Date.now() - start;
    console.log(`Vector A generated in ${timeA}ms. Length: ${vecA.length}`);

    console.log(`Generating embedding for: "${textB}"...`);
    const vecB = await getEmbedding(textB);

    console.log(`Generating embedding for: "${textC}"...`);
    const vecC = await getEmbedding(textC);

    const scoreAB = cosineSimilarity(vecA, vecB);
    const scoreAC = cosineSimilarity(vecA, vecC);

    console.log("\n--- RESULTS ---");
    console.log(`Similarity (Frontend vs UI Engineer): ${scoreAB.toFixed(4)} (Expected: High ~0.7+)`);
    console.log(`Similarity (Frontend vs Marketing):   ${scoreAC.toFixed(4)} (Expected: Low <0.3)`);

    if (scoreAB > scoreAC && scoreAB > 0.5) {
        console.log("\n✅ SUCCESS: Model understands semantic context!");
    } else {
        console.log("\n❌ FAILURE: Model scoring is unexpected.");
    }
}

testSemantics();
