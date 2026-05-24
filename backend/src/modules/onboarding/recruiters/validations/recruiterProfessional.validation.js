// recruiters/validations/recruiterProfessional.validation.js

const { createError } = require("../../../../utils/appError");

/**
 * Validates recruiter professional onboarding payload
 * @param {Object} data
 * @returns {Object} sanitized data
 */
const validateRecruiterProfessional = (data) => {
  const { professionalTitle } = data;

  if (!professionalTitle) {
    throw createError("Professional title is required", 400);
  }

  if (typeof professionalTitle !== "string") {
    throw createError("Professional title must be a string", 400);
  }

  const trimmedTitle = professionalTitle.trim();

  if (trimmedTitle.length < 2) {
    throw createError("Professional title is too short", 400);
  }

  return {
    professionalTitle: trimmedTitle,
  };
};

module.exports = {
  validateRecruiterProfessional,
};
