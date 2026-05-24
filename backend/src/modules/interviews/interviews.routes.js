const express = require("express");
const { schedule, listMyInterviews } = require("./interviews.controller");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireRole } = require("../../middlewares/requireRole");

const router = express.Router();

// Base: /api/interviews

router.post(
    "/schedule",
    requireAuth,
    requireRole(["RECRUITER"]),
    schedule
);

router.get(
    "/my-interviews",
    requireAuth,
    listMyInterviews
);

module.exports = router;
