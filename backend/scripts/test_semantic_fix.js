const { generateStudentEmbedding } = require("../src/modules/recommendations/utils/semanticMatcher.util");

async function test() {
    try {
        console.log("Starting test...");
        // Create a dummy student object
        const student = {
            headline: "Software Engineer",
            skills: [{ name: "JavaScript" }, { name: "Node.js" }],
            specialization: "Backend",
            about: "Experienced developer"
        };

        console.log("Generating embedding...");
        const embedding = await generateStudentEmbedding(student);

        if (embedding && embedding.length > 0) {
            console.log("SUCCESS: Embedding generated. Length:", embedding.length);
        } else {
            console.error("FAILURE: Embedding is empty or null");
        }
    } catch (error) {
        console.error("ERROR:", error);
    }
}

test();
