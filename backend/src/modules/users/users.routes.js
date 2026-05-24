const express = require("express");
const router = express.Router();
const usersController = require("./users.controller");
const recruitersController = require("./recruiters.controller");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireRole } = require("../../middlewares/requireRole");

// Public route to view recruiter/company profile
router.get("/recruiters/:id", usersController.getRecruiterProfile);

// Protected route for recruiters to view student profile
router.get("/students/:id", requireAuth, requireRole("RECRUITER"), usersController.getStudentProfile);

// Protected recruiter routes
router.use("/recruiters", requireAuth, requireRole("RECRUITER"));
router.patch("/recruiters/profile", recruitersController.updateProfile);
router.post("/recruiters/achievements", recruitersController.addAchievement);
router.delete("/recruiters/achievements/:id", recruitersController.deleteAchievement);
router.post("/recruiters/engagements", recruitersController.addEngagement);
router.patch("/recruiters/engagements/:id", recruitersController.updateEngagement);
router.delete("/recruiters/engagements/:id", recruitersController.deleteEngagement);

module.exports = router;
