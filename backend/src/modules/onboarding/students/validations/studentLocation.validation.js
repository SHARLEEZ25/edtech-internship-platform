const { createError } = require("../../../../utils/appError");


/**
 * Validate Student Location Data
 * ------------------------------
 * Expected:
 * - city: string
 * - state: string
 */
const validateStudentLocation = (data) => {
  const { city, state } = data;

  // Required fields check
  if (!city || !state) {
    throw createError("city and state are required", 400);
  }

  // Type checks
  if (typeof city !== "string" || typeof state !== "string") {
    throw createError("city and state must be strings", 400);
  }

  const cleanedCity = city.trim();
  const cleanedState = state.trim();

  // Empty string check after trimming
  if (!cleanedCity || !cleanedState) {
    throw createError("city and state cannot be empty", 400);
  }

  // Length limits (reasonable, production-safe)
  if (cleanedCity.length > 50) {
    throw createError("city cannot exceed 50 characters", 400);
  }

  if (cleanedState.length > 50) {
    throw createError("state cannot exceed 50 characters", 400);
  }

  return {
    city: cleanedCity,
    state: cleanedState,
  };
};

module.exports = {
  validateStudentLocation,
};
