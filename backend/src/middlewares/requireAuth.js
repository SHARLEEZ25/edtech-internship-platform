const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized",
    });
  }
};

module.exports = {
  requireAuth,
};
