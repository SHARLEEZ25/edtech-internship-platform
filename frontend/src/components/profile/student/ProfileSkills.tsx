import React, { useState } from 'react';

interface ProfileSkillsProps {
    skills: string[];
    isEditing: boolean;
    isSaving: boolean;
    onToggleEdit: () => void;
    onSave: () => void;
    onSkillsChange: (skills: string[]) => void;
    readOnly?: boolean;
}

export const ProfileSkills: React.FC<ProfileSkillsProps> = ({
    skills,
    isEditing,
    isSaving,
    onToggleEdit,
    onSave,
    onSkillsChange,
    readOnly = false
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddSkill = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !skills.includes(trimmed)) {
            onSkillsChange([...skills, trimmed]);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        onSkillsChange(skills.filter(s => s !== skillToRemove));
    };

    return (
        <div className="profile-card animate-fade-in">
            <div className="info-section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Focus Areas</h3>
                {!readOnly && !isEditing && (
                    <button
                        onClick={onToggleEdit}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#2D72FF',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#1d5fe8'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#2D72FF'}
                    >
                        Edit
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="experience-form animate-fade-in" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                className="bio-textarea"
                                style={{ minHeight: 'auto', padding: '0.75rem 1rem' }}
                                placeholder="Add a skill (e.g. React, UX Design) and press Enter"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                            <button
                                className="edit-btn"
                                style={{ padding: '0 1.25rem' }}
                                onClick={handleAddSkill}
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="skill-tags" style={{ marginBottom: '2rem' }}>
                        {skills.map((skill) => (
                            <span key={skill} className="skill-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingRight: '0.5rem' }}>
                                {skill}
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: '1rem', cursor: 'pointer', opacity: 0.6 }}
                                    onClick={() => handleRemoveSkill(skill)}
                                >
                                    close
                                </span>
                            </span>
                        ))}
                        {skills.length === 0 && (
                            <p className="timeline-desc" style={{ opacity: 0.5 }}>No skills added yet. Add your first skill!</p>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="save-profile-btn"
                            style={{ marginTop: 0, flex: 1 }}
                            onClick={onSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Focus Areas'}
                        </button>
                        <button
                            className="edit-btn"
                            style={{ flex: 1 }}
                            onClick={onToggleEdit}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="skill-tags">
                    {skills.map((skill) => (
                        <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                    {skills.length === 0 && (
                        <p className="timeline-desc" style={{ opacity: 0.4 }}>No focus areas added.</p>
                    )}
                </div>
            )}
        </div>
    );
};
