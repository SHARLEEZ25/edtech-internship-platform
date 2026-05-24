const path = require("path");

const MODEL_NAME = "Xenova/all-MiniLM-L6-v2";
let extractor = null;

/**
 * Singleton to load the Feature Extraction pipeline.
 */
async function loadModel() {
    if (!extractor) {
        console.log("Loading Semantic Model (first time may take seconds)...");

        // Dynamically import @xenova/transformers since it is an ES module
        const { pipeline, env } = await import("@xenova/transformers");

        // Configure cache directory to be within the project to avoid permission issues
        env.cacheDir = path.join(__dirname, "../../../../.cache");
        env.allowLocalModels = false; // Force download from HF Hub if not present

        extractor = await pipeline("feature-extraction", MODEL_NAME, {
            quantized: true, // Use int8 quantized model for speed
        });
        console.log("Semantic Model Loaded.");
    }
    return extractor;
}

/**
 * Generates a standard embedding array for a given text.
 * Returns null if text is empty.
 * @param {string} text 
 * @returns {Promise<number[] | null>}
 */
async function getEmbedding(text) {
    if (!text || !text.trim()) return null;

    const pipe = await loadModel();

    // "mean_pooling": true -> Returns a single vector representing the sentence
    // "normalize": true -> Normalizes vector for Dot Product = Cosine Similarity
    const output = await pipe(text, { pooling: "mean", normalize: true });

    // output.data is a Float32Array
    return Array.from(output.data);
}

/**
 * Calculates Cosine Similarity between two normalized vectors.
 * Since vectors are normalized, Cosine Similarity = Dot Product.
 * @param {number[]} vecA 
 * @param {number[]} vecB 
 * @returns {number} Score between -1.0 and 1.0 (1.0 is identical)
 */
function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
    }

    return dotProduct;
}

/**
 * Pre-computes embedding for a student profile.
 * Combines Headline + Skills + Specialization for maximum context.
 */
async function generateStudentEmbedding(student) {
    const skillText = student.skills ? student.skills.map(s => s.name).join(" ") : "";
    // Heavy weight on Headline (5x) to dominate noisy skills
    const text = `${student.headline || ""} ${student.headline || ""} ${student.headline || ""} ${student.headline || ""} ${student.headline || ""} ${student.specialization || ""} ${skillText} ${student.about || ""}`;
    return getEmbedding(text);
}

/**
 * Pre-computes embedding for an internship.
 * Combines Title + Domain + Skills + Description.
 */
async function generateInternshipEmbedding(internship) {
    const skillText = internship.skills ? internship.skills.join(" ") : "";
    // Heavy weight on Title
    const text = `${internship.title} ${internship.domain} ${skillText}`;
    return getEmbedding(text);
}

module.exports = {
    getEmbedding,
    cosineSimilarity,
    generateStudentEmbedding,
    generateInternshipEmbedding,
};
