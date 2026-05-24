const prisma = require("../../../../config/db");

const { createError } = require("../../../../utils/appError");


/**
 * Saves recruiter company details
 * - Ensures correct role
 * - Ensures onboarding step order
 * - Updates recruiter profile
 * - Moves onboarding to RECRUITER_DESCRIPTION
 */
const saveRecruiterCompany = async (userId, data) => {
  const { companyName, city, state } = data;

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

    if (user.onboardingStep !== "RECRUITER_COMPANY") {
      throw createError("Invalid onboarding step", 409);
    }

    if (!user.recruiterProfile) {
      throw createError("Recruiter profile not found", 404);
    }

    // Update recruiter company details
    await tx.recruiterProfile.update({
      where: { userId },
      data: {
        companyName,
        city,
        state,
      },
    });

    // Move onboarding forward
    await tx.user.update({
      where: { id: userId },
      data: {
        onboardingStep: "RECRUITER_DESCRIPTION",
      },
    });

    return true;
  });
};

module.exports = {
  saveRecruiterCompany,
};
