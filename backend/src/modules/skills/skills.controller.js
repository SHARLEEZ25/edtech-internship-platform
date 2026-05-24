const { searchSkills, createMasterSkill } = require("./skills.service");

const handleSearchSkills = async (req, res, next) => {
    try {
        const skills = await searchSkills(req.query);
        res.status(200).json(skills);
    } catch (err) {
        next(err);
    }
};

const handleCreateSkill = async (req, res, next) => {
    try {
        const { name, category } = req.body;
        if (!name || !category) {
            return res.status(400).json({ message: "Name and category are required" });
        }

        const skill = await createMasterSkill({ name, category });
        res.status(201).json(skill);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    handleSearchSkills,
    handleCreateSkill,
};
