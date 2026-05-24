const {
  saveStudentSkills,
} = require("../services/studentSkills.service");
const {
  validateStudentSkills,
} = require("../validations/studentSkills.validation");

/**
 * Controller: Student Skills Onboarding
 * ------------------------------------
 * Responsibility:
 * - Validate request body
 * - Call service layer
 * - Return HTTP response
 *
 * NO business logic here.
 */
const studentSkillsController = async (req, res, next) => {
  try {
    // 1. Validate and sanitize input
    const validatedData = validateStudentSkills(req.body);

    // 2. Save skills for the student
    await saveStudentSkills(req.user.id, validatedData);

    // 3. Respond with next onboarding step
    res.status(200).json({
      message: "Student skills saved successfully",
      nextStep: "STUDENT_LOCATION",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  studentSkillsController,
};
