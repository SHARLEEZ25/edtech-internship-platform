const jwt = require("jsonwebtoken");

/* ================= AUTHENTICATION ================= */

const protect = (req, res, next) => {
  if (!req.cookies || !req.cookies.accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = req.cookies.accessToken;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "auth-service",
    });

    if (decoded.isActive === false) {
      return res.status(403).json({ message: "Account disabled" });
    }

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* ================= AUTHORIZATION ================= */

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};
