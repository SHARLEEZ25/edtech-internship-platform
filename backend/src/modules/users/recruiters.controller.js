const recruitersService = require("./recruiters.service");

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const profile = await recruitersService.updateProfile(userId, req.body);
        res.status(200).json({
            data: profile,
            message: "Profile updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

const addAchievement = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const achievement = await recruitersService.addAchievement(userId, req.body);
        res.status(201).json({
            data: achievement,
            message: "Achievement added"
        });
    } catch (error) {
        next(error);
    }
};

const deleteAchievement = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await recruitersService.deleteAchievement(userId, id);
        res.status(200).json({
            message: "Achievement deleted"
        });
    } catch (error) {
        next(error);
    }
};

const addEngagement = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const engagement = await recruitersService.addEngagement(userId, req.body);
        res.status(201).json({
            data: engagement,
            message: "Engagement added"
        });
    } catch (error) {
        next(error);
    }
};

const updateEngagement = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const engagement = await recruitersService.updateEngagement(userId, id, req.body);
        res.status(200).json({
            data: engagement,
            message: "Engagement updated"
        });
    } catch (error) {
        next(error);
    }
};

const deleteEngagement = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await recruitersService.deleteEngagement(userId, id);
        res.status(200).json({
            message: "Engagement deleted"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateProfile,
    addAchievement,
    deleteAchievement,
    addEngagement,
    updateEngagement,
    deleteEngagement
};
