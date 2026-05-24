const prisma = require("../../config/db");
const { AppError } = require("../../utils/appError");

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

    const { title, company, startMonth, startYear, endMonth, endYear, description } = data;

    // Validation
    if (!title || !company || !startMonth || !startYear) {
        throw new AppError("Title, Company, Start Month, and Start Year are required", 400);
    }

    const parsedStartYear = parseInt(startYear);
    if (isNaN(parsedStartYear)) throw new AppError("Invalid Start Year", 400);

    const parsedEndYear = endYear ? parseInt(endYear) : null;
    if (endYear && isNaN(parsedEndYear)) throw new AppError("Invalid End Year", 400);

    return await prisma.studentExperience.create({
        data: {
            title,
            company,
            startMonth,
            startYear: parsedStartYear,
            endMonth: endMonth || null, // Handle explicitly
            endYear: parsedEndYear,
            description,
            studentId: student.id,
        },
    });
};

const updateExperience = async (userId, id, data) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    await verifyOwnership("studentExperience", id, student.id);

    const { title, company, startMonth, startYear, endMonth, endYear, description } = data;

    return await prisma.studentExperience.update({
        where: { id },
        data: {
            title,
            company,
            startMonth,
            startYear: startYear ? parseInt(startYear) : undefined,
            endMonth,
            endYear: endYear === null ? null : (endYear ? parseInt(endYear) : undefined),
            description
        },
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

    const { title, issuer, category, categoryIcon } = data;
    const finalCategory = category || categoryIcon;

    if (!finalCategory) {
        throw new AppError("Achievement category or categoryIcon is required", 400);
    }

    return await prisma.studentAchievement.create({
        data: {
            title,
            issuer,
            category: finalCategory,
            studentId: student.id,
        },
    });
};

const updateAchievement = async (userId, id, data) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    await verifyOwnership("studentAchievement", id, student.id);

    const { title, issuer, category, categoryIcon } = data;
    const finalCategory = category || categoryIcon;

    return await prisma.studentAchievement.update({
        where: { id },
        data: {
            title,
            issuer,
            category: finalCategory
        },
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

    const { title, detail, tag, icon } = data;

    return await prisma.studentEngagement.create({
        data: {
            title,
            detail,
            tag,
            icon,
            studentId: student.id,
        },
    });
};

const updateEngagement = async (userId, id, data) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    await verifyOwnership("studentEngagement", id, student.id);

    const { title, detail, tag, icon } = data;

    return await prisma.studentEngagement.update({
        where: { id },
        data: {
            title,
            detail,
            tag,
            icon
        },
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
// Core fetch logic reused by both student (by userId) and recruiter (by studentId)
const fetchProfileData = async (whereClause) => {
    const student = await prisma.studentProfile.findUnique({
        where: whereClause,
        include: {
            user: {
                select: {
                    id: true, // userId
                    email: true,
                    fullName: true,
                }
            },
            experiences: { orderBy: [{ startYear: 'desc' }, { startMonth: 'desc' }] },
            achievements: { orderBy: [{ createdAt: 'desc' }] },
            engagements: { orderBy: [{ createdAt: 'desc' }] },
            skills: true
        }
    });

    if (!student) {
        return null;
    }

    // Calculate Profile Strength (10 points, 10% each)
    let strength = 0;

    if (student.headline) strength += 10;
    if (student.about && student.about.trim().length >= 20) strength += 10;
    if (student.collegeName && student.degree) strength += 10;
    if (student.skills && student.skills.length >= 3) strength += 10;
    if (student.experiences && student.experiences.length >= 1) strength += 10;
    if (student.achievements && student.achievements.length >= 1) strength += 10;
    if (student.engagements && student.engagements.length >= 1) strength += 10;
    if (student.city && student.state) strength += 10;
    if (student.linkedinUrl || student.githubUrl || student.portfolioUrl) strength += 10;
    if (student.profilePictureUrl) strength += 10;

    return { ...student, profileStrength: strength };
};

// ==========================================
// GET ALL DETAILS
// ==========================================
// Used to fetch the full profile for editing
const getProfileDetails = async (userId) => {
    try {
        if (!prisma.studentProfile) {
            throw new Error("Prisma model undefined");
        }
        return await fetchProfileData({ userId });
    } catch (err) {
        throw err;
    }
};

const getProfileByStudentId = async (studentId) => {
    return await fetchProfileData({ id: studentId });
};

// ==========================================
// BASIC PROFILE (Bio, Role, Socials, Education, Location)
// ==========================================
const updateBasicProfile = async (userId, data) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    return await prisma.studentProfile.update({
        where: { id: student.id },
        data: {
            about: data.about,
            headline: data.headline,
            collegeName: data.collegeName,
            degree: data.degree,
            graduationYear: data.graduationYear,
            specialization: data.specialization,
            city: data.city,
            state: data.state,
            linkedinUrl: data.linkedinUrl,
            githubUrl: data.githubUrl,
            portfolioUrl: data.portfolioUrl,
            profilePictureUrl: data.profilePictureUrl
        }
    });
};

// ==========================================
// SKILLS
// ==========================================
const updateSkills = async (userId, skills) => {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new AppError("Student profile not found", 404);

    return await prisma.$transaction(async (tx) => {
        // 1. Clear existing skills
        await tx.studentSkill.deleteMany({
            where: { studentId: student.id }
        });

        // 2. Add new skills
        if (skills && skills.length > 0) {
            await tx.studentSkill.createMany({
                data: skills.map(skill => ({
                    name: skill,
                    studentId: student.id
                }))
            });
        }

        return true;
    });
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
    getProfileDetails,
    getProfileByStudentId,
    updateBasicProfile,
    updateSkills
};
