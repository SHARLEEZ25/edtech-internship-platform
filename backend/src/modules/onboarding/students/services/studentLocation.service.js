const prisma = require("../../../../config/db");
const { createError } = require("../../../../utils/appError");


const saveStudentLocation = async (userId, data) => {
  const { city, state } = data;

  return prisma.$transaction(async (tx) => {
    // 1. Fetch user with student profile
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });

    if (!user) {
      throw createError("User not found", 404);
    }

    // 2. Role & flow validation
    if (user.role !== "STUDENT") {
      throw createError("Invalid role for student onboarding", 403);
    }

    if (user.onboardingStep !== "STUDENT_LOCATION") {
      throw createError(
        "Invalid onboarding step. Expected STUDENT_LOCATION",
        409
      );
    }

    if (!user.studentProfile) {
      throw createError(
        "Student profile not found. Complete previous steps first.",
        400
      );
    }

    // 3. Update student location
    await tx.studentProfile.update({
      where: { userId },
      data: {
        city,
        state,
      },
    });

    // 4. Mark onboarding as completed
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
  saveStudentLocation,
};
