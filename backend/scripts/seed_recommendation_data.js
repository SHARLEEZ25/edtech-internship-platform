const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const MOCK_INTERNSHIPS = [
    // --- TECH: FRONTEND / FULL STACK ---
    {
        company: "Reactify Inc",
        title: "React Developer Intern",
        description: "Build modern UIs with React and Redux.",
        domain: "Web Development",
        skills: ["React", "CSS", "JavaScript"],
        internshipType: "REMOTE",
        city: "Bangalore",
        status: "LIVE",
    },
    {
        company: "VueMasters",
        title: "Frontend Engineering Intern",
        description: "Work on our core product using Vue.js and TypeScript.",
        domain: "Engineering",
        skills: ["Vue", "TypeScript", "HTML"],
        internshipType: "ONSITE",
        city: "Chennai",
        status: "LIVE",
    },
    {
        company: "WebWizards",
        title: "Junior Web Developer",
        description: "Assist in developing websites using standard web technologies.",
        domain: "Web Development",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        internshipType: "HYBRID",
        city: "Chennai",
        status: "LIVE",
    },

    // --- TECH: BACKEND ---
    {
        company: "NodeNinja",
        title: "Node.js Backend Intern",
        description: "Build robust APIs.",
        domain: "Backend",
        skills: ["Node.js", "Express", "MongoDB"],
        internshipType: "REMOTE",
        city: "Mumbai",
        status: "LIVE",
    },
    {
        company: "PyCorp",
        title: "Python Developer Intern",
        description: "Backend development with Django.",
        domain: "Backend",
        skills: ["Python", "Django", "SQL"],
        internshipType: "REMOTE",
        city: "Delhi",
        status: "LIVE",
    },

    // --- NON-TECH ---
    {
        company: "MarketMinds",
        title: "Digital Marketing Executive",
        description: "Manage social media campaigns.",
        domain: "Marketing",
        skills: ["SEO", "Content Writing", "Social Media"],
        internshipType: "REMOTE",
        city: "Chennai",
        status: "LIVE",
    },
];

async function seedRecommendationsTest() {
    console.log("--- SEEDING DIVERSE MOCK DATA ---");

    for (const data of MOCK_INTERNSHIPS) {
        // 1. Find or Create User/Recruiter for this Company
        // We use a deterministic email based on company name to avoid duplicates on re-run
        const email = `recruiter.${data.company.toLowerCase().replace(/\s/g, "")}@example.com`;

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    role: "RECRUITER",
                    fullName: `${data.company} HR`,
                    isOnboarded: true,
                    recruiterProfile: {
                        create: {
                            companyName: data.company,
                            companyDescription: "A great place to work.",
                            city: "Chennai", // Default
                            state: "Tamil Nadu",
                        }
                    }
                },
                include: { recruiterProfile: true }
            });
            console.log(`Created Company: ${data.company}`);
        }

        const recruiterProfile = await prisma.recruiterProfile.findUnique({ where: { userId: user.id } });

        // 2. Create Internship
        await prisma.internship.create({
            data: {
                recruiterId: recruiterProfile.id,
                title: data.title,
                description: data.description,
                domain: data.domain,
                internshipType: data.internshipType,
                city: data.city,
                skills: data.skills,
                status: data.status,
                // Defaults
                workType: "FULL_TIME",
                openings: 1,
                durationValue: 3,
                durationUnit: "MONTHS",
                stipendMin: 10000,
                stipendMax: 20000,
                applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
                responsibilities: ["Learn", "Code"],
                requirements: ["Passion"]
            }
        });
        console.log(`Created Job: ${data.title} at ${data.company}`);
    }

    console.log("\n--- SEEDING COMPLETE ---");
}

seedRecommendationsTest()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
