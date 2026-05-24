const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:5000/api";

const RECRUITER_EMAIL = "test_recruiter_remarks@example.com";
const PASSWORD = "password123";

async function setupRecruiter() {
    let user = await prisma.user.findUnique({ where: { email: RECRUITER_EMAIL } });
    if (!user) {
        const hash = await bcrypt.hash(PASSWORD, 12);
        user = await prisma.user.create({
            data: {
                email: RECRUITER_EMAIL,
                passwordHash: hash,
                emailVerifiedAt: new Date(),
                isOnboarded: true,
                role: "RECRUITER",
                recruiterProfile: {
                    create: {
                        companyName: "Test Corp",
                        professionalTitle: "HR"
                    }
                }
            }
        });
        console.log("✅ Created Recruiter User");
    }
    return user;
}

async function login() {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
        email: RECRUITER_EMAIL,
        password: PASSWORD
    });
    return res.headers['set-cookie'];
}

async function main() {
    try {
        await setupRecruiter();
        const cookie = await login();
        const config = { headers: { Cookie: cookie } };

        // 1. Get an existing application or create one
        const apps = await axios.get(`${BASE_URL}/applications/recruiter`, config);
        if (apps.data.data.length === 0) {
            console.log("❌ No applications found to test with. Please apply to an internship first.");
            return;
        }

        const appId = apps.data.data[0].id;
        console.log(`🚀 Testing on Application ID: ${appId}`);

        // 2. Update Remarks
        const remark1 = "First note: Potential candidate.";
        await axios.patch(`${BASE_URL}/applications/${appId}/remarks`, { remarks: remark1 }, config);
        console.log("✅ Updated remark 1");

        // 3. Update Remarks again
        const remark2 = "Second note: Interview scheduled.";
        await axios.patch(`${BASE_URL}/applications/${appId}/remarks`, { remarks: remark2 }, config);
        console.log("✅ Updated remark 2");

        // 4. Verify in DB (direct check via prisma to verify history)
        const application = await prisma.internshipApplication.findUnique({
            where: { id: appId },
            include: { remarkHistory: true }
        });

        console.log("📊 Verification Results:");
        console.log(`Current Remark: ${application.remarks}`);
        console.log(`History Count: ${application.remarkHistory.length}`);

        if (application.remarks === remark2 && application.remarkHistory.length >= 2) {
            console.log("✨ SUCCESS: Remarks and history verified!");
        } else {
            console.error("❌ FAILURE: Remarks or history mismatch.");
        }

    } catch (err) {
        console.error("❌ TEST FAILED:", err.response?.data || err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
