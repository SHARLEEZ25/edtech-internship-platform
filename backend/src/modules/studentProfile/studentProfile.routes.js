const express = require("express");
const router = express.Router();

const studentProfileController = require("./studentProfile.controller");

// Middlewares
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireVerifiedUser } = require("../../middlewares/requireVerifiedUser");
const { requireRole } = require("../../middlewares/requireRole");
const { ROLES } = require("../../utils/constant");

/**
 * Student Profile Routes
 * All routes require STUDENT role
 */
router.use(requireAuth, requireVerifiedUser);

// View Profile (Accessible by Recruiter & Student)
router.get("/view/:studentId", studentProfileController.getStudentProfileById);

// ==========================================
// STUDENT PROFILE DETAILS (Granular CRUD)
// ==========================================

// All subsequent routes require STUDENT role
router.use(requireRole(ROLES.STUDENT));

// Get Full Profile Logic for Edit
router.get("/details", studentProfileController.getProfile);

// Update Basic Info (Bio, Role, Socials, Education, Location)
router.put("/basic", studentProfileController.updateBasicProfile);

// Update Skills
router.put("/skills", studentProfileController.updateSkills);

// Experience
router.post("/experience", studentProfileController.addExperience);
router.put("/experience/:id", studentProfileController.updateExperience);
router.delete("/experience/:id", studentProfileController.deleteExperience);

// Achievement
router.post("/achievement", studentProfileController.addAchievement);
router.put("/achievement/:id", studentProfileController.updateAchievement);
router.delete("/achievement/:id", studentProfileController.deleteAchievement);

// Engagement
router.post("/engagement", studentProfileController.addEngagement);
router.put("/engagement/:id", studentProfileController.updateEngagement);
router.delete("/engagement/:id", studentProfileController.deleteEngagement);

module.exports = router;
