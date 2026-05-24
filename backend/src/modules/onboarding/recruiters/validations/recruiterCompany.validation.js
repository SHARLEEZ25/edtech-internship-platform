const { createError } = require("../../../../utils/appError");

/**
 * Validates recruiter company onboarding data
 */
const validateRecruiterCompany = (data) => {
  const { companyName, city, state } = data;

  if (!companyName || !city || !state) {
    throw createError("companyName, city and state are required", 400);
  }

  if (
    typeof companyName !== "string" ||
    typeof city !== "string" ||
    typeof state !== "string"
  ) {
    throw createError("Invalid data types for recruiter company details", 400);
  }

  return {
    companyName: companyName.trim(),
    city: city.trim(),
    state: state.trim(),
  };
};

module.exports = {
  validateRecruiterCompany,
};
