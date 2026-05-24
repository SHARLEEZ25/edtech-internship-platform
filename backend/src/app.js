const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

/* ================= GLOBAL MIDDLEWARE ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  process.env.FRONTEND_URL
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Selectively apply JSON body parsing. Skip parsing for GET /api/auth/me
const jsonParser = express.json();
app.use((req, res, next) => {
  // Do not parse body for the auth 'me' endpoint to avoid any server-side JSON.parse
  if (req.method === "GET" && req.path === "/api/auth/me") return next();
  return jsonParser(req, res, next);
});

app.use(cookieParser());

/* ================= ROUTES ================= */

app.use("/api/auth", require("./modules/auth/auth.routes"));

app.use(
  "/api/students",
  require("./modules/onboarding/students/students.routes")
);

app.use(
  "/api/recruiters",
  require("./modules/onboarding/recruiters/recruiters.routes")
);

app.use("/api/internships", require("./modules/internships/internships.routes"));
app.use("/api/applications", require("./modules/applications/applications.routes"));
app.use("/api/admin", require("./modules/admin/admin.routes"));
app.use("/api/onboarding", require("./modules/onboarding/onboarding.routes"));
app.use("/api/users", require("./modules/users/users.routes"));
app.use("/api/upload", require("./modules/upload/upload.routes"));
app.use("/api/student-profile", require("./modules/studentProfile/studentProfile.routes"));
app.use("/api/recommendations", require("./modules/recommendations/recommendations.routes"));
app.use("/api/interviews", require("./modules/interviews/interviews.routes"));

/* ================= ERROR HANDLER ================= */

const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);



module.exports = app;
