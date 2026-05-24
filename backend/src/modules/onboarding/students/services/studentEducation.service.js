const prisma = require("../../../../config/db");
const { createError } = require("../../../../utils/appError");


const saveStudentEducation = async (userId, data) => {
  const { collegeName, degree, graduationYear, specialization } = data;

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });

    if (!user) {
      throw createError("User not found", 404);
    }

    if (user.role !== "STUDENT") {
      throw createError("Invalid role for student onboarding", 403);
    }

    if (user.onboardingStep !== "STUDENT_EDUCATION") {
      throw createError(
        `Invalid onboarding step. Expected STUDENT_EDUCATION`,
        409
      );
    }

    // Create or update student profile
    if (user.studentProfile) {
      await tx.studentProfile.update({
        where: { userId },
        data: {
          collegeName,
          degree,
          graduationYear,
          specialization,
        },
      });
    } else {
      await tx.studentProfile.create({
        data: {
          userId,
          collegeName,
          degree,
          graduationYear,
          specialization,
        },
      });
    }

    // Move to next step
    await tx.user.update({
      where: { id: userId },
      data: {
        onboardingStep: "STUDENT_SKILLS",
      },
    });

    return true;
  });
};

module.exports = {
  saveStudentEducation,
};
