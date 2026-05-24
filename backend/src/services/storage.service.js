const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
const { AppError } = require("../utils/appError");

// Initialize S3 Client (only used if Provider is AWS)
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || "LOCAL"; // LOCAL or AWS
const APP_URL = process.env.APP_URL || "http://localhost:5000"; // For local URL generation

/**
 * Generate a Presigned Upload URL (or Local equivalent)
 * @param {string} fileName - Original filename
 * @param {string} fileType - MIME type
 */
const getPresignedUploadUrl = async (fileName, fileType) => {
    // 1. Validation
    const ALLOWED_TYPES = ["application/pdf"];
    if (!ALLOWED_TYPES.includes(fileType)) {
        throw new AppError("Invalid file type. Only PDF is allowed.", 400);
    }

    // Generate unique key
    const uuid = crypto.randomUUID();
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_"); // Sanitize
    const key = `uploads/${uuid}-${safeName}`;

    // 2. AWS S3 Flow
    if (STORAGE_PROVIDER === "AWS") {
        if (!BUCKET_NAME) {
            throw new AppError("AWS Bucket Name is not configured", 500);
        }

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: fileType,
        });

        try {
            // 60 seconds expiration
            const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
            return { uploadUrl, key };
        } catch (error) {
            console.error("S3 Presign Error:", error);
            throw new AppError("Failed to generate upload URL", 500);
        }
    }

    // 3. Local (Dev) Flow
    // Return a local URL that the frontend can PUT to.
    // Format: http://localhost:5000/api/upload/local/{key}
    // The key needs to be URL encoded just in case, though our safeName handles most.
    // Note: key contains 'uploads/' prefix, we keep it.

    const uploadUrl = `${APP_URL}/api/upload/local/${encodeURIComponent(key)}`;

    return { uploadUrl, key };
};

module.exports = {
    getPresignedUploadUrl,
    STORAGE_PROVIDER
};
