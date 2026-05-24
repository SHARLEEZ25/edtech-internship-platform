// controllers/recruiterDescription.controller.js
const {
  validateRecruiterDescription,
} = require("../validations/recruiterDescription.validation");
const {
  saveRecruiterDescription,
} = require("../services/recruiterDescription.service");

/**
 * Controller for recruiter description onboarding step
 */
const saveRecruiterDescriptionController = async (req, res, next) => {
  try {
    const validData = validateRecruiterDescription(req.body);

    await saveRecruiterDescription(req.user.id, validData);

    res.status(200).json({
      message: "Recruiter onboarding completed successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  saveRecruiterDescription: saveRecruiterDescriptionController,
};
