import React from 'react';


interface ApplicationSkillsProps {
    skills: any[] | undefined | null;
}

export const ApplicationSkills: React.FC<ApplicationSkillsProps> = ({ skills }) => {
    return (
        <div className="skills-section">
            <h4 className="info-label">SKILLS</h4>
            <div className="skills-list">
                {Array.isArray(skills) && skills.map((skill: any, idx: number) => (
                    <span key={idx} className="skill-pill">
                        {typeof skill === 'string' ? skill : skill.name}
                    </span>
                ))}
                {(!skills || skills.length === 0) && (
                    <span className="text-muted italic">No skills listed</span>
                )}
            </div>
        </div>
    );
};
