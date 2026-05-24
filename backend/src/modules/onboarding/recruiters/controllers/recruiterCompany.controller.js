const { saveRecruiterCompany } = require("../services/recruiterCompany.service");
const {
  validateRecruiterCompany,
} = require("../validations/recruiterCompany.validation");

/**
 * Controller to handle recruiter company onboarding step
 */
const saveRecruiterCompanyController = async (req, res, next) => {
  try {
    const validData = validateRecruiterCompany(req.body);

    await saveRecruiterCompany(req.user.id, validData);

    res.status(201).json({
      message: "Recruiter company details saved successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  saveRecruiterCompany: saveRecruiterCompanyController,
};
