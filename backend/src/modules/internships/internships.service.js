const prisma = require("../../config/db");
const { AppError } = require("../../utils/appError");

/**
 * Create a new internship
 */
const createInternship = async (data, recruiterId) => {
  // Verify recruiter profile exists
  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId: recruiterId },
  });

  if (!recruiter) {
    throw new AppError("Recruiter profile not found", 404);
  }

  return await prisma.internship.create({
    data: {
      ...data,
      recruiterId: recruiter.id,
    },
  });
};

/**
 * Get internship by ID
 */
const getInternshipById = async (id, userId = null) => {
  const internship = await prisma.internship.findFirst({
    where: { id, deletedAt: null },
    include: {
      recruiter: {
        select: {
          companyName: true,
          companyWebsite: true,
          companyDescription: true,
          professionalTitle: true,
          city: true,
          state: true,
          id: true,
        },
      },
      _count: {
        select: {
          applications: {
            where: { status: { not: "WITHDRAWN" } }
          }
        }
      }
    },
  });

  if (!internship) return null;

  // Calculate stats for recruiters
  let stats = null;
  const recruiter = await prisma.recruiterProfile.findUnique({ where: { userId } });

  // If the requester is the owner of the internship, calculate pipeline stats
  if (recruiter && internship.recruiterId === recruiter.id) {
    const [totalApplications, shortlisted, interviews, selected] = await Promise.all([
      prisma.internshipApplication.count({
        where: { internshipId: id, status: { not: "WITHDRAWN" } }
      }),
      prisma.internshipApplication.count({
        where: { internshipId: id, status: "SHORTLISTED" }
      }),
      prisma.internshipApplication.count({
        where: { internshipId: id, status: "INTERVIEW" }
      }),
      prisma.internshipApplication.count({
        where: { internshipId: id, status: "SELECTED" }
      })
    ]);

    stats = {
      totalApplications,
      shortlisted,
      interviews,
      offersSent: selected
    };
  }

  let hasApplied = false;
  let isSaved = false;

  // Check if current user has applied (if userId provided)
  if (userId) {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (student) {
      const application = await prisma.internshipApplication.findUnique({
        where: {
          internshipId_studentId: {
            internshipId: id,
            studentId: student.id,
          },
        },
      });
      if (application && application.status !== "WITHDRAWN") hasApplied = true;

      // Check if saved
      const saved = await prisma.savedInternship.findUnique({
        where: {
          studentId_internshipId: {
            studentId: student.id,
            internshipId: id
          }
        }
      });
      if (saved) isSaved = true;
    }
  }

  return { ...internship, hasApplied, isSaved, stats };
};

/**
 * Update internship
 */
const updateInternship = async (id, data, userId) => {
  const internship = await prisma.internship.findFirst({
    where: { id, deletedAt: null },
    include: { recruiter: true },
  });

  if (!internship) {
    throw new AppError("Internship not found or has been deleted", 404);
  }

  if (internship.recruiter.userId !== userId) {
    throw new AppError("You do not have permission to update this internship", 403);
  }

  return await prisma.internship.update({
    where: { id },
    data,
  });
};

/**
 * List internships with filters
 */
const listInternships = async (filters, userId, role) => {
  const {
    page = 1,
    limit = 10,
    search,
    domain,
    location,
    type,
    workType,
    minStipend,
    status
  } = filters;

  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = { deletedAt: null };

  // Role-based filtering
  if (role === "RECRUITER") {
    // Recruiters see only their own internships
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: { userId },
    });
    if (!recruiter) return { internships: [], total: 0 };
    where.recruiterId = recruiter.id;

    // Optional status filter for recruiter
    if (status) where.status = status;
  } else {
    // Students/Public see only LIVE internships
    where.status = "LIVE";

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { recruiter: { companyName: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Filter by specific recruiter (Company Profile View)
    // Assumes `filters.recruiterId` is the RecruiterProfile ID (which matches Internship.recruiterId)
    if (filters.recruiterId) {
      where.recruiterId = filters.recruiterId;
    }

    if (domain) where.domain = { contains: domain, mode: "insensitive" }; // Partial match or exact? Using contains/insensitive for flexibility
    if (location) where.OR = [
      { city: { contains: location, mode: "insensitive" } },
      { state: { contains: location, mode: "insensitive" } },
    ];
    if (type) where.internshipType = type;
    if (workType) where.workType = workType;
    if (minStipend) where.stipendMax = { gte: parseInt(minStipend) };
    /* original line 129 */
  }

  // Filter out applied internships for students (unless includeApplied is true)
  if (role !== "RECRUITER" && !filters.includeApplied) {
    const student = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (student) {
      const applications = await prisma.internshipApplication.findMany({
        where: {
          studentId: student.id,
          status: { not: "WITHDRAWN" }
        },
        select: { internshipId: true },
      });
      const appliedInternshipIds = applications.map((app) => app.internshipId);

      if (appliedInternshipIds.length > 0) {
        where.id = { notIn: appliedInternshipIds };
      }
    }
  }

  // Check for saved status for students
  let savedInternshipIds = new Set();
  if ((role === "STUDENT" || !role) && userId) {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (student) {
      const saved = await prisma.savedInternship.findMany({
        where: { studentId: student.id },
        select: { internshipId: true }
      });
      savedInternshipIds = new Set(saved.map(s => s.internshipId));
    }
  }

  const [internships, total] = await Promise.all([
    prisma.internship.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        recruiter: {
          select: {
            companyName: true,
            city: true,
            state: true,
          }
        },
        _count: {
          select: {
            applications: {
              where: { status: { not: "WITHDRAWN" } }
            }
          } // Recruiters might want this, useful for heat/popularity for students too
        }
      },
    }),
    prisma.internship.count({ where }),
  ]);

  const internshipsWithStatus = internships.map(internship => ({
    ...internship,
    isSaved: savedInternshipIds.has(internship.id)
  }));

  return { internships: internshipsWithStatus, total, page, totalPages: Math.ceil(total / take) };
};

/**
 * Apply for internship
 */
const applyForInternship = async (userId, internshipId, applicationData) => {
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
    include: { user: true }
  });

  if (!student) {
    throw new AppError("Student profile not found. Please complete onboarding.", 400);
  }

  // Enforce identity from verified user account (Email only)
  const verifiedEmail = student.user.email;

  // Validate Phone
  const phone = applicationData.phone || "";
  const cleanPhone = phone.replace(/\D/g, ""); // Remove non-digits

  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    throw new AppError("Please provide a valid phone number (10-15 digits)", 400);
  }

  // Check if already applied
  const existingApplication = await prisma.internshipApplication.findUnique({
    where: {
      internshipId_studentId: {
        internshipId,
        studentId: student.id,
      },
    },
  });

  if (existingApplication && existingApplication.status !== "WITHDRAWN") {
    throw new AppError("You have already applied for this internship", 409);
  }

  // Check internship status
  const internship = await prisma.internship.findUnique({ where: { id: internshipId } });
  if (!internship || internship.status !== "LIVE") {
    throw new AppError("This internship is not accepting applications", 400);
  }

  // Check deadline
  if (internship.applicationDeadline) {
    const deadline = new Date(internship.applicationDeadline);
    const today = new Date();
    // Reset time to midnight for fair comparison
    today.setHours(0, 0, 0, 0);
    deadline.setHours(23, 59, 59, 999);

    if (today > deadline) {
      throw new AppError("Application deadline has passed", 400);
    }
  }

  if (existingApplication && existingApplication.status === "WITHDRAWN") {
    // Re-activate application
    return await prisma.internshipApplication.update({
      where: { id: existingApplication.id },
      data: {
        fullName: applicationData.fullName || student.user.fullName, // Allow custom name
        email: verifiedEmail,       // Enforced
        phone: applicationData.phone,
        resumeUrl: applicationData.resumeUrl,
        coverLetter: applicationData.coverLetter,
        portfolioUrl: applicationData.portfolioUrl,
        linkedinUrl: applicationData.linkedinUrl,
        githubUrl: applicationData.githubUrl,
        status: "APPLIED",
        withdrawnAt: null, // Clear withdrawn date
        statusHistory: {
          create: {
            toStatus: "APPLIED",
            changedBy: userId,
            fromStatus: "WITHDRAWN"
          }
        }
      }
    });
  }

  return await prisma.internshipApplication.create({
    data: {
      internshipId,
      studentId: student.id,
      fullName: applicationData.fullName || student.user.fullName, // Allow custom name
      email: verifiedEmail,       // Enforced
      phone: applicationData.phone,
      resumeUrl: applicationData.resumeUrl,
      coverLetter: applicationData.coverLetter,
      portfolioUrl: applicationData.portfolioUrl,
      linkedinUrl: applicationData.linkedinUrl,
      githubUrl: applicationData.githubUrl,
      status: "APPLIED",
      statusHistory: {
        create: {
          toStatus: "APPLIED",
          changedBy: userId // Self
        }
      }
    },
  });
};

/**
 * Get saved internships (Placeholder for now until model is fully verified/migrated if separate model)
 * NOTE: The user asked for "SavedInternship" model but I noticed I only added it to implementation plan in the previous turn. 
 * Wait, I missed adding `SavedInternship` to the `schema.prisma` in the previous execution step!
 * 
 * Re-checking the previous turn: 
 * The user provided a schema BLOCK in the prompt: "model Internship {...} model InternshipApplication {...} model ApplicationStatusHistory {...}" 
 * The USER DID NOT PROVIDE `SavedInternship`. 
 * BUT my implementation plan had `SavedInternship`.
 * 
 * I should stick to what I committed to the file. I did NOT add `SavedInternship` to `schema.prisma` because the user's prompt specifically gave me the models to add and `SavedInternship` was NOT in the user's snippet.
 * 
 * I will NOT implement save/unsave for now, or I will add it as a TODO. Or I can add the model now if I think it's critical. 
 * The user said "go through designs... help me design db schema...". 
 * Then later "does this follow designs?". 
 * Then "enum InternshipType... model Internship... Update existing models... add this to our existing db."
 * 
 * The user's snippet was EXPLICIT. I should respect it. 
 * However, the design shows "Save" functionality (bookmark icon).
 * I will omit Save functionality for this specific file write for now to avoid breaking if schema doesn't have it.
 * actually, I should double check if I added it. I recall running `prisma format` on the user's snippet.
 * 
 * Let's stick to the deployed schema. `InternshipApplication` exists.
 */

// Removing save/unsave from service for now or implementing if valid.
// I'll stick to Create, List, Get, Apply.

/**
 * Get applications for an internship (Recruiter only)
 */
const getInternshipApplications = async (internshipId, userId) => {
  // Check ownership
  const internship = await prisma.internship.findUnique({
    where: { id: internshipId },
    include: { recruiter: true },
  });

  if (!internship) {
    throw new AppError("Internship not found", 404);
  }

  if (internship.recruiter.userId !== userId) {
    throw new AppError("You do not have permission to view applications for this internship", 403);
  }

  const applications = await prisma.internshipApplication.findMany({
    where: {
      internshipId,
      status: { not: "WITHDRAWN" }
    },
    include: {
      student: {
        select: {
          collegeName: true,
          degree: true,
          graduationYear: true,
          city: true,
          state: true,
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });

  return applications;
};

/**
 * Get applications for the logged-in student
 */
const getStudentApplications = async (userId) => {
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!student) {
    throw new AppError("Student profile not found", 404);
  }

  const applications = await prisma.internshipApplication.findMany({
    where: {
      studentId: student.id,
      status: { not: "WITHDRAWN" }
    },
    select: {
      id: true,
      internshipId: true,
      studentId: true,
      status: true,
      appliedAt: true,
      updatedAt: true,
      fullName: true,
      email: true,
      phone: true,
      resumeUrl: true,
      coverLetter: true,
      githubUrl: true,
      linkedinUrl: true,
      portfolioUrl: true,
      remarks: true,
      internship: {
        select: {
          id: true,
          title: true,
          domain: true,
          internshipType: true,
          city: true,
          state: true,
          stipendMin: true,
          stipendMax: true,
          stipendCurrency: true,
          stipendPeriod: true,
          durationValue: true,
          durationUnit: true,
          applicationDeadline: true,
          recruiter: {
            select: {
              companyName: true,
              city: true,
              state: true, // In case internship location is null
            },
          },
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });

  return applications;
};

/**
 * Soft delete an internship
 */
const deleteInternship = async (id, userId) => {
  const internship = await prisma.internship.findFirst({
    where: { id, deletedAt: null },
    include: { recruiter: true },
  });

  if (!internship) {
    throw new AppError("Internship not found", 404);
  }

  if (internship.recruiter.userId !== userId) {
    throw new AppError("You do not have permission to delete this internship", 403);
  }

  return await prisma.internship.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

const withdrawApplication = async (userId, internshipId) => {
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!student) {
    throw new AppError("Student profile not found", 404);
  }

  // Check if application exists
  const application = await prisma.internshipApplication.findUnique({
    where: {
      internshipId_studentId: {
        internshipId,
        studentId: student.id,
      },
    },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (application.status === "WITHDRAWN") {
    throw new AppError("Application is already withdrawn", 400);
  }

  // Soft delete (Withdraw) the application
  await prisma.internshipApplication.update({
    where: {
      internshipId_studentId: {
        internshipId,
        studentId: student.id,
      },
    },
    data: {
      status: "WITHDRAWN",
      withdrawnAt: new Date(),
      statusHistory: {
        create: {
          toStatus: "WITHDRAWN",
          fromStatus: application.status,
          changedBy: userId
        }
      }
    }
  });

  return { message: "Application withdrawn successfully" };
};

const saveInternship = async (userId, internshipId) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!student) throw new AppError("Student profile not found", 404);

  // Check if already saved
  const existing = await prisma.savedInternship.findUnique({
    where: {
      studentId_internshipId: {
        studentId: student.id,
        internshipId
      }
    }
  });

  if (existing) return { message: "Internship already saved" };

  await prisma.savedInternship.create({
    data: {
      studentId: student.id,
      internshipId
    }
  });

  return { message: "Internship saved successfully" };
};

const unsaveInternship = async (userId, internshipId) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!student) throw new AppError("Student profile not found", 404);

  try {
    await prisma.savedInternship.delete({
      where: {
        studentId_internshipId: {
          studentId: student.id,
          internshipId
        }
      }
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return { message: "Internship was not saved" };
    }
    throw err;
  }

  return { message: "Internship unsaved successfully" };
};

const getSavedInternships = async (userId) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!student) throw new AppError("Student profile not found", 404);

  const saved = await prisma.savedInternship.findMany({
    where: { studentId: student.id },
    include: {
      internship: {
        include: {
          recruiter: {
            select: {
              companyName: true,
              city: true,
              state: true
            }
          },
          _count: {
            select: {
              applications: {
                where: { status: { not: "WITHDRAWN" } }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return saved.map(s => ({ ...s.internship, isSaved: true }));
};

/**
 * Get recommended internships for a student
 * Uses a weighted scoring algorithm:
 * - Skills Match (40%)
 * - Location/Type Match (30%)
 * - Domain/Title Match (15%)
 * - Freshness (10%)
 * - Opportunity/Low Competition (5%)
 */
const getRecommendedInternships = async (userId) => {
  // 1. Get Student Context
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      skills: true,
      user: true // for name? not needed
    }
  });

  if (!student) throw new AppError("Student profile not found", 404);

  // 2. Fetch Candidates (Live Internships)
  // Optimization: Fetch top 200 most recent active internships to score
  // Filters out ones they've already applied to or withdrawn from
  const appliedInternships = await prisma.internshipApplication.findMany({
    where: { studentId: student.id },
    select: { internshipId: true }
  });
  const appliedIds = new Set(appliedInternships.map(a => a.internshipId));

  const candidates = await prisma.internship.findMany({
    where: {
      status: "LIVE",
      deletedAt: null,
      id: { notIn: Array.from(appliedIds) }
    },
    take: 200,
    orderBy: { createdAt: "desc" },
    include: {
      recruiter: {
        select: {
          companyName: true,
          companyDescription: true, // Need this for better keyword match?
          city: true,
          state: true
        }
      },
      _count: {
        select: {
          applications: { where: { status: { not: "WITHDRAWN" } } }
        }
      }
    }
  });

  // Cold start fallback if no candidates (unlikely)
  if (candidates.length === 0) return [];

  // 3. User Context for matching
  const userSkills = student.skills.map(s => s.name.toLowerCase());
  const userCity = student.city ? student.city.toLowerCase() : "";
  const userState = student.state ? student.state.toLowerCase() : "";
  const userSpecialization = student.specialization ? student.specialization.toLowerCase() : "";

  // 4. Scoring Loop
  const scored = candidates.map(internship => {
    let score = 0;

    // --- A. Skills Match (40%) ---
    // Internship raw skills usually string array. normalize.
    const internSkills = internship.skills.map(s => s.toLowerCase());
    if (internSkills.length > 0 && userSkills.length > 0) {
      // Token-Based Fuzzy Match
      // 1. Tokenize both sets (split by space, slash, comma, etc.)
      const getTokens = (str) => str.split(/[\s/\-,]+/).filter(t => t.length > 2); // Filter out tiny words like "of", "in" or symbols

      const allInternTokens = new Set();
      internSkills.forEach(s => getTokens(s).forEach(t => allInternTokens.add(t)));

      let matchedWeight = 0;
      let totalWeight = internSkills.length; // Raw count for denominator

      // Check user skills against intern tokens
      // If user has "React", and intern has "React.js", "React Native" -> Match

      // Better approach: Count how many INTERNSHIP skills are "covered" by user skills
      let skillsCovered = 0;

      for (const iSkill of internSkills) {
        const iTokens = getTokens(iSkill);
        let isCovered = false;

        for (const uSkill of userSkills) {
          const uTokens = getTokens(uSkill);
          // Check intersection
          const overlap = iTokens.some(it => uTokens.includes(it));
          if (overlap) {
            isCovered = true;
            break;
          }
        }
        if (isCovered) skillsCovered++;
      }

      const ratio = skillsCovered / totalWeight;
      score += ratio * 40;


    }

    // --- B. Location/Type Match (30%) ---
    if (internship.internshipType === "REMOTE") {
      score += 30; // Max points for remote
    } else {
      const internCity = internship.city ? internship.city.toLowerCase() : "";
      const internState = internship.state ? internship.state.toLowerCase() : "";

      if (userCity && internCity === userCity) {
        score += 30;
      } else if (userState && internState === userState) {
        score += 15; // Same state partial credit
      }
    }

    // --- C. Domain/Title Keyword Match (15%) ---
    const title = internship.title.toLowerCase();
    const domain = internship.domain.toLowerCase();

    // 1. Exact Domain Match or Title contains Specialization
    if (userSpecialization) {
      if (domain.includes(userSpecialization) || userSpecialization.includes(domain)) {
        score += 15;
      } else if (title.includes(userSpecialization)) {
        score += 15;
        // 2. Partial breakdown
      } else {
        // Simple keyword check?
      }
    }

    // --- D. Freshness Boost (10%) ---
    const daysOld = (new Date() - new Date(internship.createdAt)) / (1000 * 60 * 60 * 24);
    if (daysOld < 3) score += 10;
    else if (daysOld < 7) score += 7;
    else score += 3;

    // --- E. Opportunity Boost (5%) ---
    const appCount = internship._count.applications;
    if (appCount < 10) score += 5;
    else if (appCount < 50) score += 2;

    return { ...internship, relevanceScore: Math.round(score) };
  });

  // 5. Sort by Score (Desc)
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // 6. Return Top 4 (1 for Featured + 3 for List)
  return scored.slice(0, 4);
};

module.exports = {
  createInternship,
  getInternshipById,
  updateInternship,
  deleteInternship,
  listInternships,
  applyForInternship,
  getInternshipApplications,
  getStudentApplications,
  withdrawApplication,
  saveInternship,
  unsaveInternship,
  getSavedInternships,
  getRecommendedInternships
};
