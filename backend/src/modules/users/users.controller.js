const usersService = require("./users.service");
const studentProfileService = require("../studentProfile/studentProfile.service");

const getRecruiterProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const profile = await usersService.getRecruiterProfile(id);
        res.status(200).json({
            data: profile,
            message: "Recruiter profile fetched successfully",
        });
    } catch (error) {
        next(error);
    }
};

const getStudentProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const profile = await studentProfileService.getProfileByStudentId(id);

        if (!profile) {
            return res.status(404).json({
                error: true,
                message: "Student profile not found",
            });
        }

        res.status(200).json({
            data: profile,
            message: "Student profile fetched successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRecruiterProfile,
    getStudentProfile,
};
