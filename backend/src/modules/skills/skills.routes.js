const router = require("express").Router();
const { handleSearchSkills, handleCreateSkill } = require("./skills.controller");
const { protect } = require("../../middlewares/auth");

// Public or Protected?
// Searching skills might be public or require auth. Let's assume protected for now as it's part of app.
router.get("/", protect, handleSearchSkills);
router.post("/", protect, handleCreateSkill);

module.exports = router;
