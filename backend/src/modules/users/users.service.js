const prisma = require("../../config/db");
const { AppError } = require("../../utils/appError");

const getRecruiterProfile = async (id) => {
    const recruiter = await prisma.recruiterProfile.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true, // userId
                    email: true,
                    fullName: true,
                }
            },
            achievements: true,
            engagements: true
        }
    });

    if (!recruiter) {
        throw new AppError("Recruiter not found", 404);
    }

    // Dynamic completion calculation (8 points)
    let completedFields = 0;
    const totalFields = 8;

    if (recruiter.companyName && recruiter.companyName !== 'Company Name') completedFields++;
    if (recruiter.professionalTitle) completedFields++;
    if (recruiter.companyDescription && recruiter.companyDescription.length > 20) completedFields++;
    if (recruiter.city || recruiter.state) completedFields++;
    if (recruiter.hiringRoles && recruiter.hiringRoles.length > 0) completedFields++;
    if (recruiter.achievements && recruiter.achievements.length > 0) completedFields++;
    if (recruiter.engagements && recruiter.engagements.length > 0) completedFields++;
    if (recruiter.studentsHired > 0 || recruiter.yearsOfExperience > 0) completedFields++;

    const completionPercentage = Math.round((completedFields / totalFields) * 100);

    // Rich profile check (Premium content)
    const isRichProfile = (
        (recruiter.achievements && recruiter.achievements.length > 0) ||
        (recruiter.engagements && recruiter.engagements.length > 0) ||
        (recruiter.studentsHired > 0 || recruiter.yearsOfExperience > 0)
    );

    return {
        id: recruiter.id,
        userId: recruiter.user.id,
        email: recruiter.user.email,
        fullName: recruiter.user.fullName,
        companyName: recruiter.companyName,
        companyDescription: recruiter.companyDescription,
        companyWebsite: recruiter.companyWebsite,
        city: recruiter.city,
        state: recruiter.state,
        professionalTitle: recruiter.professionalTitle,
        hiringRoles: recruiter.hiringRoles,
        linkedinUrl: recruiter.linkedinUrl,
        twitterUrl: recruiter.twitterUrl,
        achievements: recruiter.achievements,
        engagements: recruiter.engagements,
        studentsHired: recruiter.studentsHired,
        activePostings: recruiter.activePostings,
        retentionRate: recruiter.retentionRate,
        yearsOfExperience: recruiter.yearsOfExperience,
        completionPercentage,
        isRichProfile
    };
};

module.exports = {
    getRecruiterProfile,
};
