const applicationService = require("./applications.service");
const { successResponse } = require("../../utils/response");

const updateStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const application = await applicationService.updateApplicationStatus(
      req.params.id,
      status,
      req.user.id,
      remarks
    );

    successResponse(res, 200, {
      message: "Application status updated successfully",
      data: application
    });
  } catch (err) {
    next(err);
  }
};

const updateRemarks = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const application = await applicationService.updateApplicationRemarks(
      req.params.id,
      remarks,
      req.user.id
    );

    successResponse(res, 200, {
      message: "Application remarks updated successfully",
      data: application
    });
  } catch (err) {
    next(err);
  }
};

const getRecruiterList = async (req, res, next) => {
  // ... existing code
  try {
    const applications = await applicationService.getRecruiterApplications(req.user.id);
    successResponse(res, 200, {
      data: applications
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const application = await applicationService.getApplicationById(
      req.params.id,
      req.user.id
    );

    successResponse(res, 200, {
      data: application
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateStatus,
  updateRemarks,
  getRecruiterList,
  getOne,
};
