# File Upload Architecture & Guide

This document details the **Hybrid File Upload System** implemented in the Thozhil Backend. It is designed to be **cost-free for development** while being **cloud-scalable for production** without changing frontend logic.

## 1. Architecture Overview

We use a **Presigned URL** pattern. This shifts the burden of file transfer away from our main backend APIs and directly to the storage provider (S3 in production, Local Filesystem in dev).

### The Flow
1.  **Request Upload URL**: Frontend asks backend for permission to upload a specific file.
2.  **Generate URL**: Backend validates the request (User Auth, File Type) and generates a temporary, secure "Signed URL".
    *   **Dev Mode**: Returns a local URL handled by our backend (`http://localhost...`).
    *   **Prod Mode**: Returns a direct AWS S3 URL (`https://s3.amazonaws.com...`).
3.  **Upload File**: Frontend `PUT`s the binary file data directly to the returned URL.
4.  **Save Reference**: Frontend sends the **File Key** (not the full URL) to the backend to store in the database (e.g., in `resumeUrl`).

## 2. Configuration (`.env`)

Control the behavior using the `STORAGE_PROVIDER` variable.

### Mode: Local Development (Default)
This simulates S3 behavior. Files are saved to `public/uploads` on the server disk.
```env
STORAGE_PROVIDER=LOCAL
APP_URL=http://localhost:5000  # Used to construct the local upload URL
```

### Mode: Production (AWS S3)
Switches to real S3 Presigned URLs. Files go directly to AWS.
```env
STORAGE_PROVIDER=AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region (e.g., ap-south-1)
AWS_BUCKET_NAME=your_bucket_name
```

## 3. API Reference

### 1. Get Presigned URL
**Endpoint**: `GET /api/upload/presigned-url`
**Auth**: Required (Bearer Token)

**Query Parameters**:
-   `fileName` (Required): Original name of the file (e.g., `resume.pdf`)
-   `fileType` (Required): MIME type (Must be `application/pdf`)

**Response**:
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://...", // where to PUT the file
    "key": "uploads/uuid-resume.pdf" // String to save in your DB
  }
}
```

### 2. Local PUT Handler (Dev Only)
**Endpoint**: `PUT /api/upload/local/:key`
**Auth**: Open (Relies on dev environment trust)
**Description**: Receives the file stream and writes it to `public/uploads`. Only active when `STORAGE_PROVIDER=LOCAL`.

### 3. Local File Serving (Dev Only)
**Endpoint**: `GET /api/upload/local/:key`
**Description**: Serves the uploaded file so you can view/download it during development.

## 4. Security Measures

-   **Strict Expiration**: Upload links expire in **60 seconds**. If the upload doesn't start by then, the link becomes invalid.
-   **File Type Validation**: Only `application/pdf` is allowed. We do not accept images or executables for resumes.
-   **Randomized Filenames**: We prefix all uploads with a UUID (`uploads/uuid-filename.pdf`) to prevent overwriting existing files or guessing other users' file paths.
-   **Path Traversal Protection**: The local handler validates that keys do not contain `..` to prevent writing outside the uploads directory.

## 5. Frontend Implementation Example

```javascript
/* Step 1: Get Permission */
const { data: { uploadUrl, key } } = await axios.get("/api/upload/presigned-url", {
  params: { 
    fileName: selectedFile.name,
    fileType: selectedFile.type // Must be application/pdf
  },
  headers: { Authorization: `Bearer ${token}` }
});

/* Step 2: Upload Binary */
// IMPORTANT: You must send the raw file object, and match the Content-Type
await axios.put(uploadUrl, selectedFile, {
  headers: { "Content-Type": selectedFile.type }
});

/* Step 3: Save Reference */
await axios.post("/api/applications", {
  internshipId: "123",
  resumeUrl: key // Save the KEY, not the full URL
});
```

## 6. Deployment Checklist

When deploying to production:
1.  [ ] Create an **AWS S3 Bucket**.
2.  [ ] Configure **CORS** in the S3 Bucket settings to allow PUT requests from your frontend domain.
3.  [ ] Create an **IAM User** with programmatic access and `AmazonS3FullAccess` (or a more scoped policy allowing `PutObject` on the bucket).
4.  [ ] Set the `AWS_*` and `STORAGE_PROVIDER=AWS` environment variables in your deployment platform (Vercel/Heroku/EC2).
5.  [ ] **Important**: Do not change any frontend code. The backend will automatically start sending S3 URLs instead of local ones.
