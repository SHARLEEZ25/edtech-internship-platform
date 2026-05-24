const { createError } = require("../utils/appError");

/**
 * Ensures the user is currently on the expected onboarding step
 * This middleware is role-agnostic and works for both students and recruiters
 *
 * @param {string | string[]} allowedSteps
 */
const requireOnboardingStep = (allowedSteps) => {
  return (req, res, next) => {
    const { onboardingStep } = req.user;

    const steps = Array.isArray(allowedSteps)
      ? allowedSteps
      : [allowedSteps];

    if (!steps.includes(onboardingStep)) {
      throw createError(
        `Invalid onboarding step. Current step: ${onboardingStep}`,
        403
      );
    }

    next();
  };
};

module.exports = {
  requireOnboardingStep,
};
