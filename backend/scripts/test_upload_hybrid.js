const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:5000/api";
const STUDENT_EMAIL = "upload_test_student@example.com";
const PASSWORD = "password123";

async function login(email) {
    try {
        await prisma.user.deleteMany({ where: { email } });
        const hash = await bcrypt.hash(PASSWORD, 12);
        await prisma.user.create({
            data: {
                email,
                passwordHash: hash,
                emailVerifiedAt: new Date(),
                role: "STUDENT"
            }
        });

        const res = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password: PASSWORD
        });
        const cookies = res.headers['set-cookie'];
        return { cookies };
    } catch (e) {
        console.error(`❌ Login Failed:`, e.message);
        process.exit(1);
    }
}

async function main() {
    try {
        console.log("\n🔷 STARTING HYBRID UPLOAD TEST (LOCAL MODE)");

        // 1. Login
        const { cookies } = await login(STUDENT_EMAIL);
        const config = { headers: { Cookie: cookies } };

        // 2. Get Presigned URL
        console.log("👉 Requesting Upload URL...");
        const res = await axios.get(`${BASE_URL}/upload/presigned-url`, {
            params: {
                fileName: "resume.pdf",
                fileType: "application/pdf"
            },
            ...config
        });

        const { uploadUrl, key } = res.data;
        console.log(`✅ Received URL: ${uploadUrl}`);
        console.log(`   Key: ${key}`);

        if (!uploadUrl.includes("localhost")) {
            console.error("❌ URL should be local in dev mode");
            return;
        }

        // 3. Perform Upload
        console.log("👉 Uploading file content...");
        // Mock a simple PDF buffer (header only)
        const pdfContent = Buffer.from("%PDF-1.4\n%...");

        await axios.put(uploadUrl, pdfContent, {
            headers: { "Content-Type": "application/pdf" }
        });
        console.log("✅ PUT Request Successful");

        // 4. Verify on Disk
        const filePath = path.join(process.cwd(), "public", key); // key includes 'uploads/'
        if (fs.existsSync(filePath)) {
            console.log(`✅ File confirmed on disk: ${filePath}`);
            console.log(`   Size: ${fs.statSync(filePath).size} bytes`);
        } else {
            console.error(`❌ File NOT found on disk at ${filePath}`);
        }

        // 5. Cleanup
        // fs.unlinkSync(filePath);
        // console.log("🧹 Cleaned up test file");

    } catch (err) {
        console.error("\n❌ TEST FAILED:", err.response?.data || err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
