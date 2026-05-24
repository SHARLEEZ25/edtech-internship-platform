const { ROLES } = require("../utils/constant");

/**
 * Role-based access control middleware
 * Usage: requireRole(ROLES.STUDENT)
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
    }

    if (!Object.values(ROLES).includes(role)) {
      return res.status(500).json({
        error: true,
        message: "Invalid role configuration",
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        error: true,
        message: `Role ${role} required`,
      });
    }

    next();
  };
};

module.exports = {
  requireRole,
};
