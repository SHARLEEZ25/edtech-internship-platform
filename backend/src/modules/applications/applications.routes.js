const express = require("express");
const router = express.Router();
const applicationController = require("./applications.controller");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireRole } = require("../../middlewares/requireRole");

router.use(requireAuth);

// Recruiter routes
router.get("/recruiter", requireRole("RECRUITER"), applicationController.getRecruiterList);
router.get("/:id", applicationController.getOne);
router.patch("/:id/status", requireRole("RECRUITER"), applicationController.updateStatus);
router.patch("/:id/remarks", requireRole("RECRUITER"), applicationController.updateRemarks);

module.exports = router;
