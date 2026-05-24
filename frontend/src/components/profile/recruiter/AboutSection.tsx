// Component: AboutSection
// Purpose: Displays the company's description and basic information. Supports inline editing.
import React, { useState } from 'react';

interface AboutSectionProps {
    about: string;
    isEditing?: boolean;
    isSaving?: boolean;
    onSave?: (text: string) => void;
    onEditTrigger?: () => void;
    onCancel?: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ about, isEditing, isSaving, onSave, onEditTrigger, onCancel }) => {
    const [tempAbout, setTempAbout] = useState(about);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Sync temp state when about changes and we are not editing
    React.useEffect(() => {
        if (!isEditing) {
            setTempAbout(about);
        }
    }, [about, isEditing]);

    const handleSave = () => {
        if (onSave) onSave(tempAbout);
    };

    React.useEffect(() => {
        if (isEditing && textareaRef.current && (about === 'Add a description about your company to attract the best talent.' || !about)) {
            textareaRef.current.focus();
        }
    }, [isEditing, about]);

    // LOGIC: Determines if the user is a "First Time User" based on empty data.
    const isPlaceholder = about === 'Add a description about your company to attract the best talent.' || !about;

    return (
        <div className="profile-card about-section focus-within:ring-2 focus-within:ring-blue-100 transition-shadow">
            {/* Header with Edit Save Action */}
            <div className="info-section-header" style={{ justifyContent: 'space-between' }}>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined icon-blue">info</span>
                    <h3>About Company</h3>
                </div>
                {!isEditing && (
                    <button className="section-edit-trigger" onClick={onEditTrigger} title="Edit about">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </button>
                )}
                {isEditing && (
                    <div className="flex gap-2">
                        <button className="btn-save-inline" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save changes'}
                        </button>
                        <button className="btn-edit-profile" style={{ marginTop: 0, padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={onCancel} disabled={isSaving}>Cancel</button>
                    </div>
                )}
            </div>

            {/* About Text Content / Edit Form */}
            <div className="about-text">
                {isEditing ? (
                    /* [VISUAL STATE]: Edit Mode. Active when user clicks 'Edit Profile' or 'Write your story'. */
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            className="edit-textarea"
                            value={tempAbout}
                            onChange={(e) => setTempAbout(e.target.value)}
                            placeholder="Tell students about your company culture, mission, and what makes you unique..."
                            rows={6}
                        />
                        <div className="text-[10px] text-gray-400 mt-1 text-right">
                            {tempAbout.length} characters
                        </div>
                    </div>
                ) : isPlaceholder ? (
                    /* [VISUAL STATE]: First Time User / Empty State. Shown when 'about' prop is empty/default. */
                    <div className="empty-state-cta" style={{ border: 'none', background: 'transparent', padding: '1rem 0', alignItems: 'flex-start' }} onClick={onEditTrigger}>
                        <p style={{ textAlign: 'left', color: '#64748b' }}>Your company's story hasn't been told yet.</p>
                        <span className="cta-subtitle" style={{ textAlign: 'left', maxWidth: 'none', margin: '0.25rem 0 0.75rem 0' }}>Writing a compelling "About" section increases application rates by 40%.</span>
                        <button className="btn-add-brand">Write your story</button>
                    </div>
                ) : (
                    /* [VISUAL STATE]: Repeated User / View Mode. Shown when 'about' prop has content. */
                    <div className="clickable-view" onClick={onEditTrigger} title="Click to edit">
                        {about.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} style={{ marginBottom: idx === 0 ? '1rem' : 0 }}>{paragraph}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutSection;
