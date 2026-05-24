const requireVerifiedUser = (req, res, next) => {
  if (!req.user?.emailVerifiedAt) {
    return res.status(403).json({
      error: true,
      message: "Email not verified",
    });
  }

  // Debug (optional — remove later)
  console.log("Verified check:", {
    emailVerifiedAt: req.user.emailVerifiedAt,
    isActive: req.user.isActive,
  });

  next();
};

module.exports = {
  requireVerifiedUser,
};
