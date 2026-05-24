const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:5000/api";

const RECRUITER_EMAIL = "test_recruiter_v2@example.com";
const STUDENT_EMAIL = "test_student_v2@example.com";
const PASSWORD = "password123";

async function setupFreshUser(email) {
    // Clean up if exists
    await prisma.user.deleteMany({ where: { email } });

    // Create Base User (Verified but Not Onboarded)
    const hash = await bcrypt.hash(PASSWORD, 12);
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hash,
            emailVerifiedAt: new Date(), // Verified
            isOnboarded: false,
            onboardingStep: "ROLE_SELECTION"
        }
    });
    console.log(`✅ Created Fresh User: ${email}`);
    return user;
}

async function login(email) {
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password: PASSWORD
        });
        const cookies = res.headers['set-cookie'];
        if (!cookies) throw new Error("No cookies");
        return cookies;
    } catch (e) {
        console.error(`❌ Login Failed [${email}]:`, e.response?.data?.message || e.message);
        process.exit(1);
    }
}

async function runRecruiterFlow() {
    console.log("\n🔷 STARTING RECRUITER FLOW");
    await setupFreshUser(RECRUITER_EMAIL);
    const cookie = await login(RECRUITER_EMAIL);
    const config = { headers: { Cookie: cookie } };

    // 1. Select Role
    await axios.post(`${BASE_URL}/onboarding/select-role`, { role: "RECRUITER" }, config);
    console.log("✅ [Recruiter] Role Selected");

    // 2. Professional Details
    await axios.post(`${BASE_URL}/recruiters/onboarding/professional`, {
        professionalTitle: "HR Manager"
    }, config);
    console.log("✅ [Recruiter] Professional Details Saved");

    // 3. Company Details
    await axios.post(`${BASE_URL}/recruiters/onboarding/company`, {
        companyName: "Tech Corp",
        companyWebsite: "https://techcorp.com",
        city: "Bangalore",
        state: "Karnataka"
    }, config);
    console.log("✅ [Recruiter] Company Details Saved");

    // 4. Description (Final Step)
    await axios.post(`${BASE_URL}/recruiters/onboarding/description`, {
        companyDescription: "We build things that verify systems properly."
    }, config);
    console.log("✅ [Recruiter] Onboarding COMPLETED");

    return config;
}

async function runStudentFlow() {
    console.log("\n🔶 STARTING STUDENT FLOW");
    await setupFreshUser(STUDENT_EMAIL);
    const cookie = await login(STUDENT_EMAIL);
    const config = { headers: { Cookie: cookie } };

    // 1. Select Role
    await axios.post(`${BASE_URL}/onboarding/select-role`, { role: "STUDENT" }, config);
    console.log("✅ [Student] Role Selected");

    // 2. Education
    await axios.post(`${BASE_URL}/students/onboarding/education`, {
        collegeName: "IIT Madras",
        degree: "B.Tech",
        graduationYear: 2025
    }, config);
    console.log("✅ [Student] Education Saved");

    // 3. Skills
    await axios.post(`${BASE_URL}/students/onboarding/skills`, {
        skills: ["React", "Node.js"]
    }, config);
    console.log("✅ [Student] Skills Saved");

    // 4. Location (Final Step)
    await axios.post(`${BASE_URL}/students/onboarding/location`, {
        city: "Chennai",
        state: "Tamil Nadu"
    }, config);
    console.log("✅ [Student] Onboarding COMPLETED");

    return config;
}

async function main() {
    try {
        const recruiterConfig = await runRecruiterFlow();
        const studentConfig = await runStudentFlow();

        console.log("\n🚀 TESTING INTERNSHIP MODULE");

        // 1. Create Internship
        const internshipData = {
            title: "Frontend Intern",
            description: "React Developer needed",
            domain: "Engineering",
            internshipType: "REMOTE",
            workType: "FULL_TIME",
            city: "Remote",
            stipendMin: 10000,
            stipendMax: 20000,
            durationValue: 3,
            durationUnit: "MONTHS",
            openings: 2,
            skills: ["React"],
            requirements: ["JS"],
            responsibilities: ["Code"],
            applicationDeadline: new Date(Date.now() + 86400000).toISOString()
        };

        const createRes = await axios.post(`${BASE_URL}/internships`, internshipData, recruiterConfig);
        const internshipId = createRes.data.data.id;
        console.log(`✅ Internship Created [${internshipId}]`);

        // 2. Publish
        await axios.patch(`${BASE_URL}/internships/${internshipId}`, { status: "LIVE" }, recruiterConfig);
        console.log("✅ Internship Published (LIVE)");

        // 3. Student Lists
        const listRes = await axios.get(`${BASE_URL}/internships`, studentConfig);
        const found = listRes.data.internships.find(i => i.id === internshipId);
        if (found) console.log("✅ Internship visible to Student");
        else console.error("❌ Internship NOT visible to Student");

        // 4. Apply
        await axios.post(`${BASE_URL}/internships/${internshipId}/apply`, {
            fullName: "Test Student",
            email: "student@test.com",
            phone: "1234567890",
            resumeUrl: "http://resume.com/cv.pdf"
        }, studentConfig);
        console.log("✅ Student Applied");

        // 5. Verify Application (Recruiter)
        const appsRes = await axios.get(`${BASE_URL}/internships/${internshipId}/applications`, recruiterConfig);
        if (appsRes.data.data.length > 0) console.log("✅ Application visible to Recruiter");
        else console.error("❌ Application NOT visible to Recruiter");

        // 6. Update Status
        const appId = appsRes.data.data[0].id;
        await axios.patch(`${BASE_URL}/applications/${appId}/status`, { status: "SHORTLISTED" }, recruiterConfig);
        console.log("✅ Application Status Updated to SHORTLISTED");

    } catch (err) {
        console.error("\n❌ TEST FAILED:", err.response?.data || err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
