const express = require("express");
const router = express.Router();
const internshipController = require("./internships.controller");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireRole } = require("../../middlewares/requireRole");
const { requireOnboardingStep } = require("../../middlewares/requireOnboardingStep");

// Public/Shared routes (but must be authenticated user)
router.use(requireAuth);
router.use(requireOnboardingStep("COMPLETED"));

router.get("/", internshipController.list);

// Student routes (specific paths)
router.get("/my-applications", requireRole("STUDENT"), internshipController.getMyApplications);
router.get("/recommended", requireRole("STUDENT"), internshipController.getRecommended);
router.get("/saved", requireRole("STUDENT"), internshipController.getSaved);
router.post("/:id/apply", requireRole("STUDENT"), internshipController.apply);
router.post("/:id/save", requireRole("STUDENT"), internshipController.save);
router.delete("/:id/unsave", requireRole("STUDENT"), internshipController.unsave);
router.post("/:id/withdraw", requireRole("STUDENT"), internshipController.withdraw);

router.get("/:id", internshipController.getOne);

// Recruiter only routes
router.post("/", requireRole("RECRUITER"), internshipController.create);
router.patch("/:id", requireRole("RECRUITER"), internshipController.update);
router.delete("/:id", requireRole("RECRUITER"), internshipController.remove);
router.get("/:id/applications", requireRole("RECRUITER"), internshipController.getApplications);

module.exports = router;
