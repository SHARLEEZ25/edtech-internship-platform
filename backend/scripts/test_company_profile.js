const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:5000/api";

const RECRUITER_EMAIL = "company_profile_test_recruiter@example.com";
const PASSWORD = "password123";

async function setupRecruiter(email) {
    // Clean up if exists
    await prisma.user.deleteMany({ where: { email } });

    // Create Base User
    const hash = await bcrypt.hash(PASSWORD, 12);
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hash,
            emailVerifiedAt: new Date(),
            isOnboarded: false,
            onboardingStep: "RECRUITER_PROFESSIONAL",
            role: "RECRUITER"
        }
    });
    console.log(`✅ Created Test Recruiter: ${email} (${user.id})`);
    return user;
}

async function login(email) {
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password: PASSWORD
        });
        const cookies = res.headers['set-cookie'];
        return { cookies, token: res.data.token }; // Assuming token or cookie
    } catch (e) {
        console.error(`❌ Login Failed [${email}]:`, e.response?.data?.message || e.message);
        process.exit(1);
    }
}

async function main() {
    try {
        console.log("\n🔷 STARTING COMPANY PROFILE TEST");
        const user = await setupRecruiter(RECRUITER_EMAIL);
        const { cookies } = await login(RECRUITER_EMAIL);
        const config = { headers: { Cookie: cookies } };

        // 1. Complete Onboarding to create RecruiterProfile
        // Role Selection (already set in DB but good to follow flow or just skip to profile creation if middleware allows)
        // We'll just directly hit the profile creation endpoints to simulate onboarding

        await axios.post(`${BASE_URL}/recruiters/onboarding/professional`, {
            professionalTitle: "Talent Acquisition Lead"
        }, config);

        await axios.post(`${BASE_URL}/recruiters/onboarding/company`, {
            companyName: "Mega Corp",
            companyWebsite: "https://megacorp.com",
            city: "New York",
            state: "NY"
        }, config);

        await axios.post(`${BASE_URL}/recruiters/onboarding/description`, {
            companyDescription: "We are a big company."
        }, config);

        console.log("✅ Recruiter Onboarding Completed");

        // 2. Create an Internship
        const internshipData = {
            title: "Software Engineer Intern",
            description: "Build verify stuff",
            domain: "Engineering",
            internshipType: "REMOTE",
            workType: "FULL_TIME",
            city: "Remote",
            stipendMin: 15000,
            stipendMax: 25000,
            durationValue: 6,
            durationUnit: "MONTHS",
            openings: 5,
            skills: ["Node.js"],
            requirements: ["JS"],
            responsibilities: ["Code"],
            applicationDeadline: new Date(Date.now() + 86400000).toISOString()
        };

        const createRes = await axios.post(`${BASE_URL}/internships`, internshipData, config);
        const internshipId = createRes.data.data.id;
        console.log(`✅ Internship Created: ${internshipId}`);

        // Publish it so it's visible to public
        await axios.patch(`${BASE_URL}/internships/${internshipId}`, { status: "LIVE" }, config);
        console.log("✅ Internship Published");

        // 3. TEST: Get Recruiter Profile (Public Endpoint)
        console.log("\n🧪 TEST 1: Fetch Public Recruiter Profile");
        try {
            const profileRes = await axios.get(`${BASE_URL}/users/recruiters/${user.id}`);
            const profile = profileRes.data.data;
            console.log("Response:", JSON.stringify(profile, null, 2));

            if (profile.companyName === "Mega Corp" && profile.email === RECRUITER_EMAIL) {
                console.log("✅ Recruiter Profile Fetched Successfully & Matches");
            } else {
                console.error("❌ Recruiter Profile Mismatch");
            }
        } catch (e) {
            console.error("❌ Failed to fetch recruiter profile:", e.response?.data || e.message);
        }

        // 4. TEST: List Internships for this Recruiter
        console.log("\n🧪 TEST 2: List Internships by Recruiter ID (as Student)");

        // Setup a student to make the request (since endpoint is protected)
        const STUDENT_EMAIL = "company_profile_test_student@example.com";
        await prisma.user.deleteMany({ where: { email: STUDENT_EMAIL } });
        const sHash = await bcrypt.hash(PASSWORD, 12);
        const studentUser = await prisma.user.create({
            data: {
                email: STUDENT_EMAIL,
                passwordHash: sHash,
                emailVerifiedAt: new Date(),
                isOnboarded: true,
                onboardingStep: "COMPLETED",
                role: "STUDENT"
            }
        });

        // Login as student
        const { cookies: studentCookies } = await login(STUDENT_EMAIL);
        const studentConfig = { headers: { Cookie: studentCookies } };

        try {
            const listRes = await axios.get(`${BASE_URL}/internships`, {
                params: { recruiterId: user.id },
                ...studentConfig // Pass auth headers
            });
            const internships = listRes.data.internships;
            console.log(`Found ${internships.length} internships`);

            const found = internships.find(i => i.id === internshipId);
            if (found) {
                console.log("✅ specific internship found in recruiter filtered list");
            } else {
                console.error("❌ Internship not found in filtered list");
            }
        } catch (e) {
            console.error("❌ Failed to list internships:", e.response?.data || e.message);
        }

    } catch (err) {
        console.error("\n❌ TEST SCRIPT ERROR:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
