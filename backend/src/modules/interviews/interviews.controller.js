const interviewService = require("./interviews.service");
const { successResponse } = require("../../utils/response");
const { AppError } = require("../../utils/appError");

const schedule = async (req, res, next) => {
    try {
        const { applicationId, date, duration, mode, link, notes } = req.body;

        if (!date || !date.endsWith("Z")) {
            return next(new AppError("Interview date must be in UTC format (ending with 'Z')", 400));
        }
        const interview = await interviewService.scheduleInterview(
            req.user.id,
            applicationId,
            { date, duration, mode, link, notes }
        );
        successResponse(res, 201, {
            message: "Interview scheduled successfully",
            data: interview
        });
    } catch (err) {
        next(err);
    }
};

const listMyInterviews = async (req, res, next) => {
    try {
        let interviews;
        if (req.user.role === "STUDENT") {
            interviews = await interviewService.getStudentInterviews(req.user.id);
        } else if (req.user.role === "RECRUITER") {
            interviews = await interviewService.getRecruiterInterviews(req.user.id);
        }
        successResponse(res, 200, {
            data: interviews
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    schedule,
    listMyInterviews
};
