const express = require("express");

const {
  saveRecruiterProfessional,
} = require("./controllers/recruiterProfessional.controller");
const {
  saveRecruiterCompany,
} = require("./controllers/recruiterCompany.controller");
const {
  saveRecruiterDescription,
} = require("./controllers/recruiterDescription.controller");

const { requireAuth } = require("../../../middlewares/requireAuth");
const { requireVerifiedUser } = require("../../../middlewares/requireVerifiedUser");
const { requireRole } = require("../../../middlewares/requireRole");
const { ROLES } = require("../../../utils/constant");

const router = express.Router();

/**
 * All recruiter onboarding routes are protected
 */
router.use(
  requireAuth,
  requireVerifiedUser,
  requireRole(ROLES.RECRUITER)
);

/**
 * Recruiter onboarding routes
 */
router.post("/onboarding/professional", saveRecruiterProfessional);
router.post("/onboarding/company", saveRecruiterCompany);
router.post("/onboarding/description", saveRecruiterDescription);

module.exports = router;
