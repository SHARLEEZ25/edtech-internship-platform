const prisma = require("../../../../config/db");
const { AppError } = require("../../../../utils/appError");

// Generic helper to verify specific item ownership
const verifyOwnership = async (model, id, studentId) => {
    const item = await prisma[model].findUnique({ where: { id } });
    if (!item) throw new AppError(`${model} item not found`, 404);
    if (item.studentId !== studentId) throw new AppError("Unauthorized access to this item", 403);
    return item;
};

// ==========================================
// EXPERIENCE
// ==========================================

const addExperience = async (userId, data) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    return await prisma.studentExperience.create({
        data: {
            ...data,
            studentId: student.id,
        },
    });
};

const updateExperience = async (userId, id, data) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    await verifyOwnership("studentExperience", id, student.id);

    return await prisma.studentExperience.update({
        where: { id },
        data,
    });
};

const deleteExperience = async (userId, id) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    await verifyOwnership("studentExperience", id, student.id);

    return await prisma.studentExperience.delete({
        where: { id },
    });
};

// ==========================================
// ACHIEVEMENT
// ==========================================

const addAchievement = async (userId, data) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    return await prisma.studentAchievement.create({
        data: {
            ...data,
            studentId: student.id,
        },
    });
};

const updateAchievement = async (userId, id, data) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    await verifyOwnership("studentAchievement", id, student.id);

    return await prisma.studentAchievement.update({
        where: { id },
        data,
    });
};

const deleteAchievement = async (userId, id) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    await verifyOwnership("studentAchievement", id, student.id);

    return await prisma.studentAchievement.delete({
        where: { id },
    });
};

// ==========================================
// ENGAGEMENT
// ==========================================

const addEngagement = async (userId, data) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    return await prisma.studentEngagement.create({
        data: {
            ...data,
            studentId: student.id,
        },
    });
};

const updateEngagement = async (userId, id, data) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    await verifyOwnership("studentEngagement", id, student.id);

    return await prisma.studentEngagement.update({
        where: { id },
        data,
    });
};

const deleteEngagement = async (userId, id) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    await verifyOwnership("studentEngagement", id, student.id);

    return await prisma.studentEngagement.delete({
        where: { id },
    });
};

// ==========================================
// GET ALL DETAILS
// ==========================================
// Used to fetch the full profile for editing
const getProfileDetails = async (userId) => {
    const student = await prisma.studentProfile.findUnique({
        where: { userId },
        include: {
            experiences: { orderBy: { startDate: 'desc' } },
            achievements: { orderBy: { date: 'desc' } },
            engagements: { orderBy: { date: 'desc' } },
            skills: true
        }
    });
    if (!student) throw new AppError("Student profile not found", 404);
    return student;
};


module.exports = {
    addExperience,
    updateExperience,
    deleteExperience,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addEngagement,
    updateEngagement,
    deleteEngagement,
    getProfileDetails
};
