const recommendationService = require("./recommendations.service");

/**
 * Get recommended internships for the logged-in student
 * @route GET /api/recommendations
 */
const getRecommendations = async (req, res) => {
    try {
        const studentId = req.user.id; // From auth middleware
        const result = await recommendationService.generateRecommendations(studentId);

        res.status(200).json({
            success: true,
            message: "Recommendations generated successfully",
            data: result, // { highlighted: {}, list: [] }
        });
    } catch (error) {
        console.error("Recommendation Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to generate recommendations",
        });
    }
};

module.exports = {
    getRecommendations,
};
