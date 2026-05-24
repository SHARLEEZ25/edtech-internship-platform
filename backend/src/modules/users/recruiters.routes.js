const express = require("express");
const router = express.Router();
const recruitersController = require("./recruiters.controller");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireRole } = require("../../middlewares/requireRole");

router.use(requireAuth, requireRole("RECRUITER"));

router.patch("/profile", recruitersController.updateProfile);

router.post("/achievements", recruitersController.addAchievement);
router.delete("/achievements/:id", recruitersController.deleteAchievement);

router.post("/engagements", recruitersController.addEngagement);
router.patch("/engagements/:id", recruitersController.updateEngagement);
router.delete("/engagements/:id", recruitersController.deleteEngagement);

module.exports = router;
