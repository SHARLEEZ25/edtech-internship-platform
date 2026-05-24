const prisma = require("../../config/db");
const AppError = require("../../utils/appError");

/**
 * Update application status (Recruiter only)
 */
const updateApplicationStatus = async (applicationId, status, userId, remarks = null) => {
  // 1. Find application and related internship/recruiter
  const application = await prisma.internshipApplication.findUnique({
    where: { id: applicationId },
    include: {
      internship: {
        include: { recruiter: true },
      },
    },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  // 2. Verify ownership
  if (application.internship.recruiter.userId !== userId) {
    throw new AppError("You do not have permission to update this application", 403);
  }

  // 3. Update status and log history ensuring atomicity
  const updatedApplication = await prisma.$transaction(async (tx) => {
    // Record status history if status changed
    if (status && status !== application.status) {
      await tx.applicationStatusHistory.create({
        data: {
          applicationId,
          fromStatus: application.status,
          toStatus: status,
          changedBy: userId,
        },
      });
    }

    // Record remark if provided
    if (remarks !== null) {
      await tx.applicationRemark.create({
        data: {
          applicationId,
          content: remarks,
          authorId: userId,
        },
      });
    }

    // Update application
    const updateData = {};
    if (status) updateData.status = status;
    if (remarks !== null) updateData.remarks = remarks;

    return await tx.internshipApplication.update({
      where: { id: applicationId },
      data: updateData,
    });
  });

  return updatedApplication;
};

/**
 * Update application remarks independently
 */
const updateApplicationRemarks = async (applicationId, remarks, userId) => {
  // Reuse the logic from updateApplicationStatus but focused on remarks
  return await updateApplicationStatus(applicationId, null, userId, remarks);
};

/**
 * Get all applications for internships posted by a recruiter
 */
const getRecruiterApplications = async (userId) => {
  // 1. Find recruiter profile
  const recruiter = await prisma.recruiterProfile.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    throw new AppError("Recruiter profile not found", 404);
  }

  // 2. Find all applications for internships owned by this recruiter
  return await prisma.internshipApplication.findMany({
    where: {
      internship: {
        recruiterId: recruiter.id,
        deletedAt: null // Only active internships
      },
      status: { not: "WITHDRAWN" }
    },
    include: {
      internship: {
        select: {
          id: true,
          title: true,
          domain: true,
          status: true,
        },
      },
      student: {
        select: {
          id: true,
          collegeName: true,
          degree: true,
          graduationYear: true,
          city: true,
          state: true,
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });
};

/**
 * Get single application by ID (Recruiter only)
 */
const getApplicationById = async (applicationId, userId) => {
  const application = await prisma.internshipApplication.findUnique({
    where: { id: applicationId },
    include: {
      internship: {
        select: {
          id: true,
          title: true,
          domain: true,
          status: true,
          recruiter: true, // Need to verify ownership
          recruiterId: true
        }
      },
      student: {
        select: {
          id: true,
          userId: true, // Needed for permission check
          collegeName: true,
          degree: true,
          graduationYear: true,
          city: true,
          state: true,
          skills: true,
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      },
      statusHistory: {
        orderBy: { createdAt: "desc" }
      },
      remarkHistory: {
        orderBy: { createdAt: "desc" }
      }
    },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  // Verify ownership
  // Allow if (1) user is the recruiter owning the internship OR (2) user is the student who applied
  const isRecruiterOwner = application.internship.recruiter.userId === userId;
  const isStudentOwner = application.student.userId === userId;

  if (!isRecruiterOwner && !isStudentOwner) {
    throw new AppError("You do not have permission to view this application", 403);
  }

  return application;
};

module.exports = {
  updateApplicationStatus,
  updateApplicationRemarks,
  getRecruiterApplications,
  getApplicationById,
};
