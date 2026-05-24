const { createError } = require("../../../../utils/appError");


const validateStudentSkills = (data) => {
  const { skills } = data;

  // Must exist
  if (!skills) {
    throw createError("Skills are required", 400);
  }

  // Must be an array
  if (!Array.isArray(skills)) {
    throw createError("Skills must be an array", 400);
  }

  // At least one skill
  if (skills.length === 0) {
    throw createError("At least one skill is required", 400);
  }

  // Limit to avoid abuse / junk data
  if (skills.length > 20) {
    throw createError("You can add up to 20 skills only", 400);
  }

  // Validate each skill
  const cleanedSkills = skills.map((skill) => {
    if (typeof skill !== "string") {
      throw createError("Each skill must be a string", 400);
    }

    const trimmed = skill.trim();

    if (!trimmed) {
      throw createError("Skill cannot be empty", 400);
    }

    if (trimmed.length > 50) {
      throw createError("Skill length cannot exceed 50 characters", 400);
    }

    return trimmed;
  });

  // Remove duplicates (case-insensitive)
  const uniqueSkills = [
    ...new Set(cleanedSkills.map((s) => s.toLowerCase())),
  ];

  return {
    skills: uniqueSkills,
  };
};

module.exports = {
  validateStudentSkills,
};
