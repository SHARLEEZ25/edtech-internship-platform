// services/recruiterDescription.service.js
const prisma = require("../../../../config/db");

const { createError } = require("../../../../utils/appError");


/**
 * Saves recruiter company description and completes onboarding
 */
const saveRecruiterDescription = async (userId, data) => {
  const { companyDescription, companyWebsite } = data;

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

    if (user.onboardingStep !== "RECRUITER_DESCRIPTION") {
      throw createError("Invalid onboarding step", 409);
    }

    if (!user.recruiterProfile) {
      throw createError("Recruiter profile not found", 404);
    }

    // Update recruiter profile with description
    await tx.recruiterProfile.update({
      where: { userId },
      data: {
        companyDescription,
        companyWebsite,
      },
    });

    // Mark onboarding as completed
    await tx.user.update({
      where: { id: userId },
      data: {
        onboardingStep: "COMPLETED",
        isOnboarded: true,
      },
    });

    return true;
  });
};

module.exports = {
  saveRecruiterDescription,
};
