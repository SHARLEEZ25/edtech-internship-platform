const natural = require("natural");

/**
 * Maps common student headlines/specializations to standardize domains
 */
const DOMAIN_MAPPING = {
    // Frontend
    frontend: "Frontend Development",
    react: "Frontend Development",
    angular: "Frontend Development",
    vue: "Frontend Development",
    "web developer": "Web Development",
    "ui/ux": "Design",
    designer: "Design",

    // Backend
    backend: "Backend Development",
    node: "Backend Development",
    express: "Backend Development",
    django: "Backend Development",
    spring: "Backend Development",
    java: "Backend Development",

    // Mobile
    android: "Mobile Development",
    ios: "Mobile Development",
    flutter: "Mobile Development",
    "react native": "Mobile Development",

    // Data
    "data scientist": "Data Science",
    "machine learning": "Data Science",
    python: "Data Science",
    analyst: "Data Analytics",
};

/**
 * Checks if a student's profile aligns with the internship role.
 * @param {object} studentProfile - { headline, specialization }
 * @param {object} internship - { title, domain }
 * @returns {object} { isCompatible: boolean, score: number }
 */
const isRoleCompatible = (studentProfile, internship) => {
    let score = 0;
    let isCompatible = false;

    const studentText = `${studentProfile.headline || ""} ${studentProfile.specialization || ""}`.toLowerCase();
    const internshipText = `${internship.title} ${internship.domain}`.toLowerCase();

    // 1. Exact Domain Match (if available)
    // For now, we rely on text matching since domain enums might be loose

    // 2. Keyword Matching (Heuristic)
    const tokenizer = new natural.WordTokenizer();
    const studentTokens = tokenizer.tokenize(studentText);
    const internshipTokens = tokenizer.tokenize(internshipText);

    // Intersection
    const intersection = studentTokens.filter(token => internshipTokens.includes(token));

    if (intersection.length > 0) {
        isCompatible = true;
        // Base compatibility found.
        // Calculate Score: More overlapping keywords = higher relevance
        // Cap at 1 (100% relevance relative to weight)
        score = Math.min(intersection.length * 0.5, 1);
    }

    // 3. Fallback: Check hardcoded map
    for (const [key, domain] of Object.entries(DOMAIN_MAPPING)) {
        if (studentText.includes(key) && internshipText.includes(key)) {
            isCompatible = true;
            score = Math.max(score, 0.8); // High confidence match
        }
    }

    return { isCompatible, score };
};

module.exports = {
    isRoleCompatible,
};
