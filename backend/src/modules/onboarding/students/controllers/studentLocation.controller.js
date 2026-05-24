const {
  saveStudentLocation,
} = require("../services/studentLocation.service");
const {
  validateStudentLocation,
} = require("../validations/studentLocation.validation");



const studentLocationController = async (req, res, next) => {
  try {
    // 1. Validate input
    const validatedData = validateStudentLocation(req.body);

    // 2. Save student location
    await saveStudentLocation(req.user.id, validatedData);

    // 3. Respond — onboarding completed
    res.status(200).json({
      message: "Student onboarding completed successfully",
      nextStep: "COMPLETED",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  studentLocationController,
};
