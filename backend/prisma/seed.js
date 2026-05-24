const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const recruiters = [
    // 1. Tech - Chennai (Baseline)
    {
        email: 'recruiter.tech@example.com',
        company: 'TechFlow Systems',
        domain: 'Software',
        city: 'Chennai',
        state: 'Tamil Nadu',
        jobs: [
            {
                title: 'React Frontend Intern',
                skills: ['React', 'JavaScript', 'CSS', 'HTML'],
                domain: 'Tech',
                description: 'Join our frontend team to build scalable web apps.',
                location: 'Chennai',
                type: 'ONSITE',
                daysAgo: 1
            },
            {
                title: 'Node.js Backend Intern',
                skills: ['Node.js', 'Express', 'MongoDB'],
                domain: 'Tech',
                description: 'Work on high-performance APIs.',
                location: 'Chennai',
                type: 'HYBRID',
                daysAgo: 5
            },
            {
                title: 'Full Stack Developer',
                skills: ['React', 'Node.js', 'PostgreSQL'],
                domain: 'Tech',
                description: 'Full stack role for ambitious juniors.',
                location: 'Chennai',
                type: 'ONSITE',
                daysAgo: 10
            }
        ]
    },
    // 2. Environment - Bangalore
    {
        email: 'recruiter.startup@example.com',
        company: 'GreenEarth Startups',
        domain: 'Environment',
        city: 'Bangalore',
        state: 'Karnataka',
        jobs: [
            {
                title: 'Digital Marketing Intern',
                skills: ['SEO', 'Marketing', 'Content Writing'],
                domain: 'Marketing',
                description: 'Help us spread the word about green energy.',
                location: 'Bangalore',
                type: 'ONSITE',
                daysAgo: 2
            },
            {
                title: 'Environmental Analyst',
                skills: ['Research', 'Data Analysis', 'Python'],
                domain: 'Science',
                description: 'Analyze environmental data trends.',
                location: 'Bangalore',
                type: 'ONSITE', // Match city
                daysAgo: 15
            }
        ]
    },
    // 3. Fintech - Mumbai
    {
        email: 'recruiter.fintech@example.com',
        company: 'PayFast Solutions',
        domain: 'Fintech',
        city: 'Mumbai',
        state: 'Maharashtra',
        jobs: [
            {
                title: 'Data Science Intern',
                skills: ['Python', 'SQL', 'Machine Learning', 'Pandas'],
                domain: 'Tech',
                description: 'Analyze financial transaction patterns.',
                location: 'Mumbai',
                type: 'ONSITE',
                daysAgo: 0 // Fresh!
            },
            {
                title: 'Finance Analyst Intern',
                skills: ['Excel', 'Accounting', 'Financial Modeling'],
                domain: 'Finance',
                description: 'Support our finance team.',
                location: 'Mumbai',
                type: 'ONSITE',
                daysAgo: 8
            }
        ]
    },
    // 4. Creative - Remote (Wide appeal)
    {
        email: 'recruiter.creative@example.com',
        company: 'PixelPerfect Studio',
        domain: 'Creative',
        city: 'Remote',
        state: null,
        jobs: [
            {
                title: 'Graphic Design Intern',
                skills: ['Photoshop', 'Illustrator', 'Graphic Design'],
                domain: 'Design',
                description: 'Create stunning visuals for brands.',
                location: null,
                type: 'REMOTE',
                daysAgo: 3
            },
            {
                title: 'Video Editor Intern',
                skills: ['Premiere Pro', 'After Effects'],
                domain: 'Media',
                description: 'Edit engaging video content.',
                location: null,
                type: 'REMOTE',
                daysAgo: 12
            }
        ]
    },
    // 5. Automotive - Chennai (Location overlap with TechFlow)
    {
        email: 'recruiter.auto@example.com',
        company: 'AutoMotive X',
        domain: 'Automotive',
        city: 'Chennai',
        state: 'Tamil Nadu',
        jobs: [
            {
                title: 'Mechanical Engineering Intern',
                skills: ['AutoCAD', 'SolidWorks', 'MATLAB'],
                domain: 'Engineering',
                description: 'Design next-gen vehicle components.',
                location: 'Chennai',
                type: 'ONSITE',
                daysAgo: 6
            },
            {
                title: 'Embedded Systems Intern',
                skills: ['C++', 'Embedded C', 'Microcontrollers'],
                domain: 'Tech', // Tech domain in non-tech company
                description: 'Work on car software systems.',
                location: 'Chennai',
                type: 'ONSITE',
                daysAgo: 4
            }
        ]
    },
    // 6. EdTech - Hyderabad
    {
        email: 'recruiter.edtech@example.com',
        company: 'EduLearn Global',
        domain: 'Education',
        city: 'Hyderabad',
        state: 'Telangana',
        jobs: [
            {
                title: 'Content Developer (Math)',
                skills: ['Mathematics', 'Teaching', 'Content Writing'],
                domain: 'Education',
                description: 'Create engaging math content for high schoolers.',
                location: 'Hyderabad',
                type: 'HYBRID',
                daysAgo: 20
            },
            {
                title: 'Flutter Developer',
                skills: ['Flutter', 'Dart', 'Mobile App Development'],
                domain: 'Tech',
                description: 'Build our mobile learning app.',
                location: 'Hyderabad',
                type: 'ONSITE',
                daysAgo: 2
            }
        ]
    },
    // 7. Healthcare - Pune
    {
        email: 'recruiter.health@example.com',
        company: 'MediCare Solutions',
        domain: 'Healthcare',
        city: 'Pune',
        state: 'Maharashtra',
        jobs: [
            {
                title: 'Healthcare Operations Intern',
                skills: ['Management', 'Operations', 'Excel'],
                domain: 'Operations',
                description: 'Assist in hospital management operations.',
                location: 'Pune',
                type: 'ONSITE',
                daysAgo: 5
            },
            {
                title: 'Bioinformatics Intern',
                skills: ['Python', 'Biology', 'Genomics'],
                domain: 'Science',
                description: 'Analyze genomic data.',
                location: 'Pune',
                type: 'ONSITE',
                daysAgo: 1
            }
        ]
    },
    // 8. E-commerce - Delhi
    {
        email: 'recruiter.ecom@example.com',
        company: 'ShopEasy',
        domain: 'Retail',
        city: 'Delhi',
        state: 'Delhi',
        jobs: [
            {
                title: 'Supply Chain Intern',
                skills: ['Logistics', 'Supply Chain', 'Management'],
                domain: 'Operations',
                description: 'Optimize our delivery routes.',
                location: 'Delhi',
                type: 'ONSITE',
                daysAgo: 9
            },
            {
                title: 'React Native Developer',
                skills: ['React Native', 'JavaScript', 'Mobile App Development'],
                domain: 'Tech',
                description: 'Work on our shopping app.',
                location: 'Delhi',
                type: 'ONSITE',
                daysAgo: 3
            }
        ]
    }
];

async function main() {
    console.log('🌱 Starting diverse database seed...');

    const passwordHash = await bcrypt.hash('password123', 10);

    for (const r of recruiters) {
        // 1. Create User
        const user = await prisma.user.upsert({
            where: { email: r.email },
            update: {},
            create: {
                email: r.email,
                fullName: r.company + " Recruiter",
                passwordHash,
                role: 'RECRUITER',
                isOnboarded: true,
                onboardingStep: 'COMPLETED',
                isActive: true,
                emailVerifiedAt: new Date()
            }
        });

        // 2. Create Profile
        const profile = await prisma.recruiterProfile.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                companyName: r.company,
                professionalTitle: 'Hiring Manager',
                city: r.city === 'Remote' ? null : r.city,
                state: r.state,
                companyDescription: `We are ${r.company}, a leading firm in ${r.domain}.`,
                hiringRoles: ['Tech', 'Design', 'Marketing'],
                studentsHired: Math.floor(Math.random() * 50),
                activePostings: r.jobs.length
                // Removed invalid 'rating' field
            }
        });

        // 3. Create Internships
        for (const job of r.jobs) {
            // Check if internship already exists
            const existingInternship = await prisma.internship.findFirst({
                where: {
                    recruiterId: profile.id,
                    title: job.title
                }
            });

            if (!existingInternship) {
                // Calculate createdAt based on daysAgo
                const createdAt = new Date();
                createdAt.setDate(createdAt.getDate() - job.daysAgo);

                await prisma.internship.create({
                    data: {
                        recruiterId: profile.id,
                        title: job.title,
                        description: job.description,
                        domain: job.domain,
                        internshipType: job.type,
                        workType: 'FULL_TIME',
                        city: job.location,
                        state: r.state, // Fallback if location matches
                        stipendMin: 5000,
                        stipendMax: 20000,
                        stipendCurrency: 'INR',
                        stipendPeriod: 'MONTH',
                        durationValue: 3,
                        durationUnit: 'MONTHS',
                        openings: 2,
                        skills: job.skills,
                        requirements: ['Basic knowledge', 'Willingness to learn'],
                        responsibilities: ['Work with team', 'Complete tasks'],
                        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        status: 'LIVE',
                        createdAt: createdAt
                    }
                });
            }
        }

        console.log(`✅ Seeded ${r.company} with ${r.jobs.length} jobs`);
    }

    // 4. Create Students (Updated with Rich Profile)
    const students = [
        {
            email: "student.tech@example.com",
            fullName: "Arjun Reddy",
            city: "Chennai",
            state: "Tamil Nadu",
            degree: "B.Tech",
            specialization: "Computer Science",
            skills: ["React", "JavaScript", "Node.js"],
            headline: "Aspiring Full Stack Developer",
            about: "Passionate about building web apps and solving real-world problems.",
            experiences: [
                {
                    title: "Web Dev Intern",
                    company: "Small Biz Inc",
                    startMonth: "May",
                    startYear: 2023,
                    endMonth: "August",
                    endYear: 2023,
                    description: "Built the company website using React."
                }
            ],
            // Add Engagements if not already present in seed
            engagements: {
                create: [
                    {
                        title: "React Workshop",
                        tag: "CERTIFIED",
                        icon: "Education",
                        detail: "12 hours training"
                    }
                ]
            },
            achievements: [
                {
                    title: "First Place Hackathon",
                    issuer: "TechFest 2023",
                    category: "AWARD"
                }
            ]
        },
        {
            email: "student.data@example.com",
            fullName: "Priya Sharma",
            city: "Mumbai",
            state: "Maharashtra",
            degree: "M.Sc",
            specialization: "Data Science",
            skills: ["Python", "SQL", "Machine Learning"],
            headline: "Data Science Enthusiast",
            about: "I love finding patterns in data.",
            experiences: [],
            achievements: []
        }
    ];

    for (const s of students) {
        const user = await prisma.user.upsert({
            where: { email: s.email },
            update: {},
            create: {
                email: s.email,
                fullName: s.fullName,
                passwordHash,
                role: 'STUDENT',
                isOnboarded: true,
                onboardingStep: 'COMPLETED',
                isActive: true,
                emailVerifiedAt: new Date()
            }
        });

        await prisma.studentProfile.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                collegeName: "National Inst of Tech",
                degree: s.degree,
                graduationYear: 2025,
                specialization: s.specialization,
                city: s.city,
                state: s.state,
                headline: s.headline,
                about: s.about,
                skills: {
                    create: s.skills.map(name => ({ name }))
                },
                experiences: {
                    create: s.experiences
                },
                achievements: {
                    create: s.achievements
                }
            }
        });
        console.log(`✅ Seeded Student: ${s.fullName}`);
    }

    console.log('🚀 Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
