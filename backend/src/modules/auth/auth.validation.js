const { createError } = require("../../utils/appError");

const validateRoleSelection = (data) => {
  const { role } = data;

  if (!role) throw createError("Role is required", 400);
  if (!["STUDENT", "RECRUITER"].includes(role)) {
    throw createError("Invalid role", 400);
  }

  return { role };
};

module.exports = { validateRoleSelection };
