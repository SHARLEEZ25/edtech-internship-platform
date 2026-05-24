// validations/recruiterDescription.validation.js
const { createError } = require("../../../../utils/appError");

/**
 * Validates recruiter company description step
 */
const validateRecruiterDescription = (data) => {
  const { companyDescription, companyWebsite } = data;

  if (!companyDescription || typeof companyDescription !== "string") {
    throw createError("Company description is required", 400);
  }

  if (companyDescription.trim().length < 20) {
    throw createError(
      "Company description must be at least 20 characters",
      400
    );
  }

  if (companyWebsite && typeof companyWebsite !== "string") {
    throw createError("Company website must be a string", 400);
  }

  return {
    companyDescription: companyDescription.trim(),
    companyWebsite: companyWebsite?.trim() || null,
  };
};

module.exports = {
  validateRecruiterDescription,
};
