const prisma = require("../../config/db");
const createError = require("../../utils/appError");
const { ROLES, ONBOARDING_STEPS, RECRUITER_ONBOARDING_STEPS } = require("../../utils/constant");

const selectRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = req.user;

    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (user.onboardingStep !== ONBOARDING_STEPS.ROLE_SELECTION) {
      return res.status(409).json({
        message: "Role already selected",
      });
    }

    const nextStep =
      role === ROLES.STUDENT
        ? ONBOARDING_STEPS.STUDENT_EDUCATION
        : RECRUITER_ONBOARDING_STEPS.RECRUITER_PROFESSIONAL;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        role,
        onboardingStep: nextStep,
        isOnboarded: false,
      },
    });

    res.status(200).json({
      message: "Role selected successfully",
      nextStep,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  selectRole,
};