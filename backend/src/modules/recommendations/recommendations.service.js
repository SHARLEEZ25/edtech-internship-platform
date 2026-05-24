const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { generateStudentEmbedding, generateInternshipEmbedding, cosineSimilarity } = require("./utils/semanticMatcher.util");

/**
 * Service to generate internship recommendations (V2 - Semantic Hybrid).
 */
class RecommendationService {
  constructor() {
    this.internshipCache = new Map(); // Stores { id, embedding, internship }
    this.lastCacheUpdate = 0;
    this.CACHE_TTL = 1000 * 60 * 15; // 15 Minutes
  }

  /**
   * Refreshes the in-memory embedding cache for all LIVE internships.
   */
  async _refreshCache() {
    console.log("Refreshing Internship Embedding Cache...");
    const internships = await prisma.internship.findMany({
      where: {
        status: "LIVE",
        deletedAt: null,
      },
      include: {
        recruiter: {
          select: { companyName: true, companyDescription: true },
        },
      },
    });

    const newCache = new Map();
    for (const internship of internships) {
      try {
        const embedding = await generateInternshipEmbedding(internship);
        if (embedding) {
          newCache.set(internship.id, { internship, embedding });
        }
      } catch (err) {
        console.error(`Failed to embed internship ${internship.id}:`, err);
      }
    }

    this.internshipCache = newCache;
    this.lastCacheUpdate = Date.now();
    console.log(`Cache Refreshed. Loaded ${this.internshipCache.size} internships.`);
  }

  /**
   * Generates recommendations using Semantic Search + Hard Filters.
   * @param {string} studentId
   */
  async generateRecommendations(studentId) {
    // 0. Ensure Cache is Valid
    if (Date.now() - this.lastCacheUpdate > this.CACHE_TTL || this.internshipCache.size === 0) {
      await this._refreshCache();
    }

    // 1. Fetch Student Profile
    const student = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
      include: { skills: true },
    });

    if (!student) throw new Error("Student profile not found");

    // 2. Generate Student Embedding
    // If student has no data, this might be null - we handle that.
    let studentEmbedding = null;
    try {
      studentEmbedding = await generateStudentEmbedding(student);
    } catch (e) {
      console.warn("Could not generate student embedding:", e);
    }

    // 3. Exclusions (Applied/Saved)
    const [applied, saved] = await Promise.all([
      prisma.internshipApplication.findMany({ where: { studentId: student.id }, select: { internshipId: true } }),
      prisma.savedInternship.findMany({ where: { studentId: student.id }, select: { internshipId: true } })
    ]);
    const excludedIds = new Set([...applied, ...saved].map(i => i.internshipId));

    // 4. Candidate Scoring
    const candidates = [];
    const studentCity = student.city ? student.city.trim().toLowerCase() : "";

    for (const { internship, embedding: internshipEmbedding } of this.internshipCache.values()) {
      // --- A. HARD FILTERS (Logic Layer) ---
      if (excludedIds.has(internship.id)) continue;

      // Location Filter: Must be REMOTE or Same City
      const isRemote = internship.internshipType === "REMOTE";
      const internshipCity = internship.city ? internship.city.trim().toLowerCase() : "";
      const isCityMatch = studentCity && internshipCity && studentCity === internshipCity;

      if (!isRemote && !isCityMatch) continue;

      // --- B. SEMANTIC SCORING (AI Layer) ---
      let score = 0;
      let reason = "";

      let semanticScore = 0;
      if (studentEmbedding && internshipEmbedding) {
        semanticScore = cosineSimilarity(studentEmbedding, internshipEmbedding); // -1 to 1

        // STRICT RELEVANCE GATE:
        // Threshold 0.25 (Lowered from 0.35) filters out weak matches while keeping related domains.
        // If irrelevant, we simply SKIP this candidate.
        if (semanticScore < 0.25) continue;

        // Normalize 0.25-1.0 to a score (70 pts max)
        score += semanticScore * 70;
      }

      // --- C. BOOSTS ---
      // Location Boost
      if (isCityMatch && !isRemote) {
        score += 10;
      }

      // Freshness Boost (7 days)
      const daysOld = (Date.now() - new Date(internship.createdAt).getTime()) / (1000 * 3600 * 24);
      if (daysOld < 7) {
        score += 5;
      }

      // Generate Clean Reason
      if (semanticScore > 0.6) {
        reason = "Matches your profile & skills";
      } else if (isCityMatch) {
        reason = `Located in ${student.city}`;
      } else if (isRemote) {
        reason = "Remote opportunity";
      } else {
        reason = "Recommended for you";
      }

      candidates.push({
        ...internship,
        score,
        semanticMatch: semanticScore,
        reasons: [reason],
        reason // Main reason string
      });
    }

    // 5. Select "Most Likely" (Top Semantic Match)
    // We pick the one with highest strict semantic score (ignoring location boosts), 
    // because that means it's the best "Content Fit".
    candidates.sort((a, b) => b.semanticMatch - a.semanticMatch);

    let highlighted = null;
    if (candidates.length > 0) {
      highlighted = candidates.shift();
      highlighted.reason = "Best profile match (" + Math.round(highlighted.semanticMatch * 100) + "%)";
    }

    // 6. Sort remaining by Total Score (includes location/freshness boosts)
    candidates.sort((a, b) => b.score - a.score);

    // 7. Diversity Filter
    const finalList = [];
    const seenCompanies = new Set();
    if (highlighted?.recruiter?.companyName) seenCompanies.add(highlighted.recruiter.companyName);

    for (const cand of candidates) {
      if (finalList.length >= 3) break;
      const comp = cand.recruiter?.companyName;
      if (comp && seenCompanies.has(comp)) continue;

      finalList.push(cand);
      if (comp) seenCompanies.add(comp);
    }

    return { highlighted, list: finalList };
  }
}

module.exports = new RecommendationService();
