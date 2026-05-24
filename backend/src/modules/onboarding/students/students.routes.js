const express = require("express");

// Controllers for student onboarding steps
const {
  studentEducationController,
} = require("./controllers/studentEducation.controller");

const {
  studentSkillsController,
} = require("./controllers/studentSkills.controller");

const {
  studentLocationController,
} = require("./controllers/studentLocation.controller");

// Middlewares for authentication and authorization
const { requireAuth } = require("../../../middlewares/requireAuth");
const { requireVerifiedUser } = require("../../../middlewares/requireVerifiedUser");
const { requireRole } = require("../../../middlewares/requireRole");
const { ROLES } = require("../../../utils/constant");

const router = express.Router();

/**
 * All student onboarding routes 
 * Shared middlewares applied once for all routes below 
 */
router.use(requireAuth, requireVerifiedUser, requireRole(ROLES.STUDENT));
 
router.post("/onboarding/education", studentEducationController);
router.post("/onboarding/skills", studentSkillsController);
router.post("/onboarding/location", studentLocationController);

module.exports = router;
