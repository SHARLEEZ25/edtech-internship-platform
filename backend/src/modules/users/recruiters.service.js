const prisma = require("../../config/db");
const { AppError } = require("../../utils/appError");

/**
 * Updates basic recruiter profile information
 */
const updateProfile = async (userId, data) => {
    const {
        companyName,
        companyDescription,
        companyWebsite,
        professionalTitle,
        city,
        state,
        hiringRoles,
        linkedinUrl,
        twitterUrl,
        studentsHired,
        activePostings,
        retentionRate,
        yearsOfExperience
    } = data;

    return prisma.recruiterProfile.update({
        where: { userId },
        data: {
            companyName,
            companyDescription,
            companyWebsite,
            professionalTitle,
            city,
            state,
            hiringRoles,
            linkedinUrl,
            twitterUrl,
            studentsHired: studentsHired !== undefined ? parseInt(studentsHired) : undefined,
            activePostings: activePostings !== undefined ? parseInt(activePostings) : undefined,
            retentionRate: retentionRate !== undefined ? parseInt(retentionRate) : undefined,
            yearsOfExperience: yearsOfExperience !== undefined ? parseInt(yearsOfExperience) : undefined
        }
    });
};

/**
 * Achievements
 */
const addAchievement = async (userId, data) => {
    const profile = await prisma.recruiterProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError("Recruiter profile not found", 404);

    return prisma.recruiterAchievement.create({
        data: {
            ...data,
            recruiterId: profile.id
        }
    });
};

const deleteAchievement = async (userId, achievementId) => {
    const profile = await prisma.recruiterProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError("Recruiter profile not found", 404);

    const achievement = await prisma.recruiterAchievement.findUnique({ where: { id: achievementId } });
    if (!achievement || achievement.recruiterId !== profile.id) {
        throw new AppError("Achievement not found or unauthorized", 404);
    }

    return prisma.recruiterAchievement.delete({ where: { id: achievementId } });
};

/**
 * Engagements
 */
const addEngagement = async (userId, data) => {
    const profile = await prisma.recruiterProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError("Recruiter profile not found", 404);

    return prisma.recruiterEngagement.create({
        data: {
            ...data,
            recruiterId: profile.id
        }
    });
};

const updateEngagement = async (userId, engagementId, data) => {
    const profile = await prisma.recruiterProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError("Recruiter profile not found", 404);

    const engagement = await prisma.recruiterEngagement.findUnique({ where: { id: engagementId } });
    if (!engagement || engagement.recruiterId !== profile.id) {
        throw new AppError("Engagement not found or unauthorized", 404);
    }

    return prisma.recruiterEngagement.update({
        where: { id: engagementId },
        data
    });
};

const deleteEngagement = async (userId, engagementId) => {
    const profile = await prisma.recruiterProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError("Recruiter profile not found", 404);

    const engagement = await prisma.recruiterEngagement.findUnique({ where: { id: engagementId } });
    if (!engagement || engagement.recruiterId !== profile.id) {
        throw new AppError("Engagement not found or unauthorized", 404);
    }

    return prisma.recruiterEngagement.delete({ where: { id: engagementId } });
};

module.exports = {
    updateProfile,
    addAchievement,
    deleteAchievement,
    addEngagement,
    updateEngagement,
    deleteEngagement
};
