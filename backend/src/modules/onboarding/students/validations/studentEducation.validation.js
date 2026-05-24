const { createError } = require("../../../../utils/appError");


const validateStudentEducation = (data) => {
  const { collegeName, degree, graduationYear, specialization } = data;

  // Required fields check
  if (!collegeName || !degree || !graduationYear) {
    throw createError(
      "collegeName, degree and graduationYear are required",
      400
    );
  }

  // Type checks
  if (typeof collegeName !== "string" || typeof degree !== "string") {
    throw createError("collegeName and degree must be strings", 400);
  }

  if (specialization && typeof specialization !== "string") {
    throw createError("specialization must be a string", 400);
  }

  if (typeof graduationYear !== "number") {
    throw createError("graduationYear must be a number", 400);
  }

  // Graduation year sanity check
  const currentYear = new Date().getFullYear();
  if (graduationYear < currentYear || graduationYear > currentYear + 5) {
    throw createError(`Graduation year must be between ${currentYear} and ${currentYear + 5}`, 400);
  }

  // Return sanitized data
  return {
    collegeName: collegeName.trim(),
    degree: degree.trim(),
    specialization: specialization ? specialization.trim() : null,
    graduationYear,
  };
};

module.exports = {
  validateStudentEducation,
};
