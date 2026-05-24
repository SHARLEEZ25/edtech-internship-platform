const router = require("express").Router();
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireVerifiedUser } = require("../../middlewares/requireVerifiedUser");
const { selectRole } = require("./select-role.controller");

router.post(
  "/select-role",
  requireAuth,
  requireVerifiedUser,
  selectRole
);

module.exports = router;
