const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { AppError } = require("../../utils/appError");
const emailService = require("../../modules/auth/email.service");

/**
 * Schedule a new interview
 */
const scheduleInterview = async (recruiterId, applicationId, data) => {
    const { date, duration, mode, link, notes } = data;

    // 1. Verify Application exists and belongs to this recruiter
    const application = await prisma.internshipApplication.findUnique({
        where: { id: applicationId },
        include: {
            internship: {
                include: {
                    recruiter: {
                        include: { recruiterProfile: true }
                    }
                }
            },
            student: true
        }
    });

    if (!application) {
        throw new AppError("Application not found", 404);
    }

    if (application.internship.recruiterId !== recruiterId) {
        throw new AppError("You are not authorized to schedule interviews for this application", 403);
    }

    // 2. Create Interview
    // We store the date as provided (Client should send ISO string)
    const interview = await prisma.interview.create({
        data: {
            applicationId,
            recruiterId,
            studentId: application.studentId,
            date: new Date(date),
            duration: parseInt(duration) || 30,
            mode,
            link,
            notes,
            status: "SCHEDULED"
        }
    });

    // 3. Sync Status -> INTERVIEW
    await prisma.internshipApplication.update({
        where: { id: applicationId },
        data: { status: "INTERVIEW" }
    });

    // 4. Add to Status History
    await prisma.applicationStatusHistory.create({
        data: {
            applicationId,
            fromStatus: application.status,
            toStatus: "INTERVIEW",
            changedBy: recruiterId
        }
    });

    // 5. Send Notification
    const companyName = application.internship.recruiter.recruiterProfile.companyName || "The Company";
    try {
        await emailService.sendInterviewScheduledEmail({
            to: application.student.email,
            studentName: application.student.fullName,
            companyName,
            date,
            link,
            mode
        });
    } catch (error) {
        console.error("Failed to send interview email:", error);
        // Continue without failing the request
    }

    return interview;
};

/**
 * Get interviews for a student
 */
const getStudentInterviews = async (studentId) => {
    return await prisma.interview.findMany({
        where: { studentId },
        include: {
            recruiter: {
                include: { recruiterProfile: { select: { companyName: true } } }
            },
            application: {
                include: { internship: { select: { title: true, domain: true } } }
            }
        },
        orderBy: { date: 'asc' }
    });
};

/**
 * Get interviews for a recruiter (Optional, mostly they view via Applications)
 */
const getRecruiterInterviews = async (recruiterId) => {
    return await prisma.interview.findMany({
        where: { recruiterId },
        include: {
            student: { select: { fullName: true, email: true, studentProfile: { select: { profilePictureUrl: true } } } },
            application: {
                include: { internship: { select: { title: true } } }
            }
        },
        orderBy: { date: 'asc' }
    });
};

module.exports = {
    scheduleInterview,
    getStudentInterviews,
    getRecruiterInterviews
};
