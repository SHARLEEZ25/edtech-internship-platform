const FRONTEND_URL =
    process.env.FRONTEND_URL || "http://localhost:5173";

module.exports = {
    GOOGLE_CALLBACK_URL: `${FRONTEND_URL}/google/callback`,
};
