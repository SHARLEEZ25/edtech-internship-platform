const internshipService = require("./internships.service");
const { successResponse } = require("../../utils/response");
const { AppError } = require("../../utils/appError");

const create = async (req, res, next) => {
  try {
    const internship = await internshipService.createInternship(req.body, req.user.id);
    successResponse(res, 201, {
      message: "Internship created successfully",
      data: internship
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const internship = await internshipService.updateInternship(req.params.id, req.body, req.user.id);
    successResponse(res, 200, {
      message: "Internship updated successfully",
      data: internship
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const internship = await internshipService.getInternshipById(req.params.id, userId);
    if (!internship) {
      throw new AppError("Internship not found", 404);
    }
    successResponse(res, 200, {
      data: internship
    });
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const { page, limit, search, domain, location, type, workType, minStipend, status, recruiterId, includeApplied } = req.query;
    const filters = { page, limit, search, domain, location, type, workType, minStipend, status, recruiterId, includeApplied };

    // Pass user ID and role to service to determine what to show
    const result = await internshipService.listInternships(filters, req.user.id, req.user.role);

    successResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
};

const apply = async (req, res, next) => {
  try {
    const application = await internshipService.applyForInternship(req.user.id, req.params.id, req.body);
    successResponse(res, 201, {
      message: "Application submitted successfully",
      application
    });
  } catch (err) {
    next(err);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const applications = await internshipService.getInternshipApplications(req.params.id, req.user.id);
    successResponse(res, 200, {
      data: applications
    });
  } catch (err) {
    next(err);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await internshipService.getStudentApplications(req.user.id);
    successResponse(res, 200, {
      data: applications
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await internshipService.deleteInternship(req.params.id, req.user.id);
    successResponse(res, 200, {
      message: "Internship deleted successfully"
    });
  } catch (err) {
    next(err);
  }
};

const withdraw = async (req, res, next) => {
  try {
    const result = await internshipService.withdrawApplication(req.user.id, req.params.id);
    successResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
};

const save = async (req, res, next) => {
  try {
    const result = await internshipService.saveInternship(req.user.id, req.params.id);
    successResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
};

const unsave = async (req, res, next) => {
  try {
    const result = await internshipService.unsaveInternship(req.user.id, req.params.id);
    successResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
};

const getSaved = async (req, res, next) => {
  try {
    const savedInternships = await internshipService.getSavedInternships(req.user.id);
    successResponse(res, 200, {
      data: savedInternships
    });
  } catch (err) {
    next(err);
  }
};

const getRecommended = async (req, res, next) => {
  try {
    const internships = await internshipService.getRecommendedInternships(req.user.id);
    successResponse(res, 200, {
      data: internships
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  update,
  remove,
  getOne,
  list,
  apply,
  withdraw,
  save,
  unsave,
  getSaved,
  getRecommended,
  getApplications,
  getMyApplications,
  // remove, // Duplicated? Check original
};

