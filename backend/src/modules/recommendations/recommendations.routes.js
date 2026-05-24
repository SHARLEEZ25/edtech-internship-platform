const express = require("express");
const router = express.Router();
const recommendationsController = require("./recommendations.controller");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireRole } = require("../../middlewares/requireRole");

router.get(
    "/",
    requireAuth,
    requireRole("STUDENT"),
    recommendationsController.getRecommendations
);

module.exports = router;
