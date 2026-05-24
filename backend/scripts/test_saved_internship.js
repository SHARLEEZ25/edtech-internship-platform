const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:5000/api";

const RECRUITER_EMAIL = "test_recruiter_saved@example.com";
const STUDENT_EMAIL = "test_student_saved@example.com";
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

    await axios.post(`${BASE_URL}/onboarding/select-role`, { role: "RECRUITER" }, config);
    await axios.post(`${BASE_URL}/recruiters/onboarding/professional`, { professionalTitle: "HR Manager" }, config);
    await axios.post(`${BASE_URL}/recruiters/onboarding/company`, { companyName: "Tech Corp", companyWebsite: "https://techcorp.com", city: "Bangalore", state: "Karnataka" }, config);
    await axios.post(`${BASE_URL}/recruiters/onboarding/description`, { companyDescription: "We build things that verify systems properly." }, config);
    console.log("✅ [Recruiter] Onboarding COMPLETED");

    return config;
}

async function runStudentFlow() {
    console.log("\n🔶 STARTING STUDENT FLOW");
    await setupFreshUser(STUDENT_EMAIL);
    const cookie = await login(STUDENT_EMAIL);
    const config = { headers: { Cookie: cookie } };

    await axios.post(`${BASE_URL}/onboarding/select-role`, { role: "STUDENT" }, config);
    await axios.post(`${BASE_URL}/students/onboarding/education`, { collegeName: "IIT Madras", degree: "B.Tech", graduationYear: 2025 }, config);
    await axios.post(`${BASE_URL}/students/onboarding/skills`, { skills: ["React"] }, config);
    await axios.post(`${BASE_URL}/students/onboarding/location`, { city: "Chennai", state: "Tamil Nadu" }, config);
    console.log("✅ [Student] Onboarding COMPLETED");

    return config;
}

async function main() {
    try {
        const recruiterConfig = await runRecruiterFlow();
        const studentConfig = await runStudentFlow();

        console.log("\n🚀 TESTING SAVED INTERNSHIPS");

        // 1. Create Internship (Recruiter)
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
        await axios.patch(`${BASE_URL}/internships/${internshipId}`, { status: "LIVE" }, recruiterConfig);
        console.log(`✅ Internship Created & Published [${internshipId}]`);

        // 2. Student Lists (Before Saving)
        let listRes = await axios.get(`${BASE_URL}/internships`, studentConfig);
        let found = listRes.data.internships.find(i => i.id === internshipId);
        if (found) {
            console.log(`✅ [List Internships] Found internship. isSaved = ${found.isSaved}`);
            if (found.isSaved === true) throw new Error("Internship is saved but shouldn't be yet");
        } else throw new Error("Internship not found in list");

        // 3. Save Internship
        await axios.post(`${BASE_URL}/internships/${internshipId}/save`, {}, studentConfig);
        console.log("✅ Internship Saved");

        // 4. Verify Saved List
        const savedRes = await axios.get(`${BASE_URL}/internships/saved`, studentConfig);
        if (savedRes.data.data.some(i => i.id === internshipId)) {
            console.log("✅ [My Saved] Internship found in Saved list");
        } else {
            throw new Error("Internship missing from saved list");
        }

        // 5. Verify Main List isSaved Status
        listRes = await axios.get(`${BASE_URL}/internships`, studentConfig);
        found = listRes.data.internships.find(i => i.id === internshipId);
        if (found && found.isSaved === true) {
            console.log("✅ [List Internships] Internship marked as isSaved = true");
        } else {
            throw new Error("Internship NOT marked as isSaved in list");
        }

        // 6. Verify Get One isSaved Status
        const getOneRes = await axios.get(`${BASE_URL}/internships/${internshipId}`, studentConfig);
        if (getOneRes.data.data.isSaved === true) {
            console.log("✅ [GetOne] Internship marked as isSaved = true");
        } else {
            throw new Error("Internship NOT marked as isSaved in GetOne");
        }

        // 7. Unsave Internship
        await axios.delete(`${BASE_URL}/internships/${internshipId}/unsave`, studentConfig);
        console.log("✅ Internship Unsaved");

        // 8. Verify Unsaved
        const savedRes2 = await axios.get(`${BASE_URL}/internships/saved`, studentConfig);
        if (!savedRes2.data.data.some(i => i.id === internshipId)) {
            console.log("✅ [My Saved] Internship removed from Saved list");
        } else {
            throw new Error("Internship STILL in saved list after unsave");
        }

        // 9. Verify Main List isSaved Status (False)
        listRes = await axios.get(`${BASE_URL}/internships`, studentConfig);
        found = listRes.data.internships.find(i => i.id === internshipId);
        if (found && found.isSaved === false) {
            console.log("✅ [List Internships] Internship marked as isSaved = false");
        } else {
            throw new Error("Internship incorrectly marked as isSaved in list");
        }

        console.log("\n✅✅ ALL SAVED INTERNSHIP TESTS PASSED ✅✅");

    } catch (err) {
        console.error("\n❌ TEST FAILED:", err.response?.data || err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
