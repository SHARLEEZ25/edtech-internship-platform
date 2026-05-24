const express = require("express");
const router = express.Router();
const uploadController = require("./upload.controller");
const { requireAuth } = require("../../middlewares/requireAuth");

// Generate URL (Protected)
router.get("/presigned-url", requireAuth, uploadController.getUploadUrl);

// Local Dev Handlers
// Note: In real S3, PUT is handled by AWS. Here we handle it.
// We don't necessarily need auth for the PUT itself if we want to simulate S3 (S3 uses signature in query/headers).
// But for simplicity/security in dev, we can leave it open or check headers. 
// S3 Presigned URL puts auth in the Query String. 
// For now, we'll keep the PUT route public to simulate the "direct to authenticated resource" nature,
// relying on the fact it's dev setup.
router.put("/local/:key", uploadController.uploadLocalFile);
router.get("/local/:key", uploadController.serveLocalFile);

module.exports = router;
