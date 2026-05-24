// recruiters/controllers/recruiterProfessional.controller.js

const {
  saveRecruiterProfessional,
} = require("../services/recruiterProfessional.service");
const {
  validateRecruiterProfessional,
} = require("../validations/recruiterProfessional.validation");

/**
 * Controller to handle recruiter professional onboarding
 */
const saveRecruiterProfessionalController = async (req, res, next) => {
  try {
    const validData = validateRecruiterProfessional(req.body);

    await saveRecruiterProfessional(req.user.id, validData);

    res.status(201).json({
      message: "Recruiter professional details saved successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  saveRecruiterProfessional: saveRecruiterProfessionalController,
};
