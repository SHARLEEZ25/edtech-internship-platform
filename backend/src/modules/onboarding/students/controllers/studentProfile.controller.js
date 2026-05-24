const studentProfileService = require("../services/studentProfile.service");
const { successResponse } = require("../../../../utils/response");

// ==========================================
// GENERIC GET
// ==========================================
const getProfile = async (req, res, next) => {
    try {
        const profile = await studentProfileService.getProfileDetails(req.user.id);
        successResponse(res, 200, profile);
    } catch (err) {
        next(err);
    }
};

// ==========================================
// EXPERIENCE
// ==========================================

const addExperience = async (req, res, next) => {
    try {
        const result = await studentProfileService.addExperience(req.user.id, req.body);
        successResponse(res, 201, result);
    } catch (err) {
        next(err);
    }
};

const updateExperience = async (req, res, next) => {
    try {
        const result = await studentProfileService.updateExperience(req.user.id, req.params.id, req.body);
        successResponse(res, 200, result);
    } catch (err) {
        next(err);
    }
};

const deleteExperience = async (req, res, next) => {
    try {
        await studentProfileService.deleteExperience(req.user.id, req.params.id);
        successResponse(res, 200, { message: "Experience deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// ==========================================
// ACHIEVEMENT
// ==========================================

const addAchievement = async (req, res, next) => {
    try {
        const result = await studentProfileService.addAchievement(req.user.id, req.body);
        successResponse(res, 201, result);
    } catch (err) {
        next(err);
    }
};

const updateAchievement = async (req, res, next) => {
    try {
        const result = await studentProfileService.updateAchievement(req.user.id, req.params.id, req.body);
        successResponse(res, 200, result);
    } catch (err) {
        next(err);
    }
};

const deleteAchievement = async (req, res, next) => {
    try {
        await studentProfileService.deleteAchievement(req.user.id, req.params.id);
        successResponse(res, 200, { message: "Achievement deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// ==========================================
// ENGAGEMENT
// ==========================================

const addEngagement = async (req, res, next) => {
    try {
        const result = await studentProfileService.addEngagement(req.user.id, req.body);
        successResponse(res, 201, result);
    } catch (err) {
        next(err);
    }
};

const updateEngagement = async (req, res, next) => {
    try {
        const result = await studentProfileService.updateEngagement(req.user.id, req.params.id, req.body);
        successResponse(res, 200, result);
    } catch (err) {
        next(err);
    }
};

const deleteEngagement = async (req, res, next) => {
    try {
        await studentProfileService.deleteEngagement(req.user.id, req.params.id);
        successResponse(res, 200, { message: "Engagement deleted successfully" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProfile,
    addExperience,
    updateExperience,
    deleteExperience,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addEngagement,
    updateEngagement,
    deleteEngagement
};
