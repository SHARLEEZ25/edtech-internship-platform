const prisma = require("../../config/db");
const { createError } = require("../../utils/appError");

/**
 * Search skills by name (for autocomplete)
 * @param {Object} query - { q: "string" }
 */
const searchSkills = async (query) => {
    const { q } = query;

    if (!q) {
        // Return all or limit? Let's return trending or popular if no query?
        // For now, return all grouped by category? Or just list.
        // User wants "list of skills already", so maybe return all.
        return prisma.masterSkill.findMany({
            take: 100,
            orderBy: { name: "asc" },
        });
    }

    return prisma.masterSkill.findMany({
        where: {
            name: {
                contains: q,
                mode: "insensitive",
            },
        },
        take: 50,
        orderBy: { name: "asc" },
    });
};

/**
 * Create a new master skill
 * @param {Object} data - { name, category }
 */
const createMasterSkill = async (data) => {
    const { name, category } = data;

    // Check if exists
    const existing = await prisma.masterSkill.findUnique({
        where: { name },
    });

    if (existing) {
        return existing;
    }

    return prisma.masterSkill.create({
        data: {
            name,
            category,
        },
    });
};

module.exports = {
    searchSkills,
    createMasterSkill,
};
