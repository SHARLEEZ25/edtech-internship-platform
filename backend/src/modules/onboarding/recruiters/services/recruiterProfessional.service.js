// recruiters/services/recruiterProfessional.service.js

const prisma = require("../../../../config/db");

const { createError } = require("../../../../utils/appError");


/**
 * Saves recruiter professional details
 * @param {string} userId
 * @param {Object} data
 */
const saveRecruiterProfessional = async (userId, data) => {
  const { professionalTitle } = data;

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { recruiterProfile: true },
    });

    if (!user) {
      throw createError("User not found", 404);
    }

    if (user.role !== "RECRUITER") {
      throw createError("Invalid role for recruiter onboarding", 403);
    }

    if (user.onboardingStep !== "RECRUITER_PROFESSIONAL") {
      throw createError("Invalid onboarding step", 409);
    }

    // Create recruiter profile if it doesn't exist
    if (!user.recruiterProfile) {
      await tx.recruiterProfile.create({
        data: {
          userId,
          professionalTitle,
        },
      });
    } else {
      await tx.recruiterProfile.update({
        where: { userId },
        data: { professionalTitle },
      });
    }

    // Move to next onboarding step
    await tx.user.update({
      where: { id: userId },
      data: {
        onboardingStep: "RECRUITER_COMPANY",
      },
    });

    return true;
  });
};

module.exports = {
  saveRecruiterProfessional,
};
