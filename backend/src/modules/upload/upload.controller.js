const fs = require("fs");
const path = require("path");
const { getPresignedUploadUrl, STORAGE_PROVIDER } = require("../../services/storage.service");
const { successResponse } = require("../../utils/response");
const { AppError } = require("../../utils/appError");

/**
 * Generate Presigned URL
 * GET /api/upload/presigned-url?fileName=x&fileType=y
 */
const getUploadUrl = async (req, res, next) => {
    try {
        const { fileName, fileType } = req.query;

        if (!fileName || !fileType) {
            throw new AppError("fileName and fileType are required", 400);
        }

        const result = await getPresignedUploadUrl(fileName, fileType);

        successResponse(res, 200, result);
    } catch (err) {
        next(err);
    }
};

/**
 * Handle Local File Upload (PUT)
 * PUT /api/upload/local/:key
 * Dev only. Pipes request body to file.
 */
const uploadLocalFile = (req, res, next) => {
    // Security check: Only allowed in LOCAL mode
    if (STORAGE_PROVIDER === "AWS") {
        return next(new AppError("Local upload not allowed in Production/AWS mode", 403));
    }

    const { key } = req.params;
    const decodedKey = decodeURIComponent(key); // e.g., uploads/uuid-file.pdf

    // Basic path traversal protection
    if (decodedKey.includes("..")) {
        return next(new AppError("Invalid key", 400));
    }

    // Ensure 'uploads' directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    // We strip the 'uploads/' prefix from key if it exists to verify path, 
    // but actually we want all files in public/uploads. 
    // Key is 'uploads/uuid-name'. So path.basename(key) gives 'uuid-name'.

    const fileName = path.basename(decodedKey);
    // Ensure dir exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, fileName);

    const writeStream = fs.createWriteStream(filePath);

    req.pipe(writeStream);

    writeStream.on("finish", () => {
        res.status(200).json({ message: "File uploaded successfully" });
    });

    writeStream.on("error", (err) => {
        console.error("Local upload error:", err);
        next(new AppError("File upload failed", 500));
    });
};

/**
 * Serve Local File
 * GET /api/upload/local/:key
 * Useful for verifying the upload or viewing the file locally.
 */
const serveLocalFile = (req, res, next) => {
    if (STORAGE_PROVIDER === "AWS") {
        return next(new AppError("Local file serving not active in AWS mode", 404));
    }

    const { key } = req.params;
    const decodedKey = decodeURIComponent(key);
    if (decodedKey.includes("..")) return next(new AppError("Invalid key", 400));

    const fileName = path.basename(decodedKey); // Strip 'uploads/'
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    if (!fs.existsSync(filePath)) {
        return next(new AppError("File not found", 404));
    }

    res.sendFile(filePath);
};

module.exports = {
    getUploadUrl,
    uploadLocalFile,
    serveLocalFile
};
