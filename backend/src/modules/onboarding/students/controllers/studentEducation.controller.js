const {
  saveStudentEducation,
} = require("../services/studentEducation.service");
const {
  validateStudentEducation,
} = require("../validations/studentEducation.validation");

const studentEducationController = async (req, res, next) => {
  try {
    const validatedData = validateStudentEducation(req.body);

    await saveStudentEducation(req.user.id, validatedData);

    res.status(200).json({
      message: "Student education saved successfully",
      nextStep: "STUDENT_SKILLS",
      refreshAuth: true,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  studentEducationController,
};
