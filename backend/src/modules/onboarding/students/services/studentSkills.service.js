const prisma = require("../../../../config/db");
const { createError } = require("../../../../utils/appError");



const saveStudentSkills = async (userId, data) => {
  const { skills } = data;

  return prisma.$transaction(async (tx) => {
    // 1. Fetch user and student profile
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });

    if (!user) {
      throw createError("User not found", 404);
    }

    // 2. Authorization & flow checks
    if (user.role !== "STUDENT") {
      throw createError("Invalid role for student onboarding", 403);
    }

    // ✅ trust DB value, not token snapshot
    if (user.onboardingStep !== "STUDENT_SKILLS") {
      throw createError(
        `Invalid onboarding step. Expected STUDENT_SKILLS, got ${user.onboardingStep}`,
        409
      );
    }

    if (!user.studentProfile) {
      throw createError(
        "Student profile not found. Complete education step first.",
        400
      );
    }

    const studentId = user.studentProfile.id;

    // 3. Clear existing skills (idempotent behavior)
    // This allows users to re-submit safely
    await tx.studentSkill.deleteMany({
      where: { studentId },
    });

    // 4. Insert new skills
    await tx.studentSkill.createMany({
      data: skills.map((skill) => ({
        name: skill,
        studentId,
      })),
    });

    // 5. Move onboarding to next step
    await tx.user.update({
      where: { id: userId },
      data: {
        onboardingStep: "STUDENT_LOCATION",
      },
    });

    return true;
  });
};

module.exports = {
  saveStudentSkills,
};
