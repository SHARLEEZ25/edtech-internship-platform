// Component: PersonalProfileDetails
// Purpose: Form to view and edit the recruiter's personal/professional details. Including title, company, location, and description.
import React from 'react';
import type { AuthUser } from '@/context/AuthContext';
import type { PersonalProfileFormData } from '@/hooks/profile/recruiter/useRecruiterPersonalProfile';

interface PersonalProfileDetailsProps {
    user: AuthUser | null;
    isEditing: boolean;
    isSaving: boolean;
    formData: PersonalProfileFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSave: () => void;
    onCancel: () => void;
}

const PersonalProfileDetails: React.FC<PersonalProfileDetailsProps> = ({
    user,
    isEditing,
    isSaving,
    formData,
    onInputChange,
    onSave,
    onCancel
}) => {
    return (
        <div className="profile-card" style={{ padding: '2rem' }}>
            {/* Header Section Section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>badge</span>
                    <h3 className="profile-section-title">Onboarding Details</h3>
                </div>

                {/* Edit Mode Actions */}
                {isEditing && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={onCancel}
                            disabled={isSaving}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '50px',
                                border: '1px solid #cbd5e1',
                                background: 'white',
                                color: '#64748b',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '50px',
                                border: 'none',
                                background: '#2563eb',
                                color: 'white',
                                fontWeight: 600,
                                cursor: isSaving ? 'wait' : 'pointer',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {isSaving && <span className="material-symbols-outlined spin" style={{ fontSize: '16px' }}>progress_activity</span>}
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>

                {/* Professional Title Input */}
                <div className="info-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#94a3b8' }}>work</span>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Professional Title</label>
                    </div>
                    {isEditing ? (
                        /* [VISUAL STATE]: Edit Mode. Input field active. */
                        <input
                            type="text"
                            name="professionalTitle"
                            value={formData.professionalTitle}
                            onChange={onInputChange}
                            className="profile-input"
                        />
                    ) : (
                        /* [VISUAL STATE]: View Mode. Display text. */
                        <p style={{ fontSize: '1rem', color: '#1a1a1a', fontWeight: 500, margin: 0, paddingLeft: 'calc(18px + 0.5rem)' }}>
                            {user?.professionalTitle || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>Not specified</span>}
                        </p>
                    )}
                </div>

                {/* Company Name Input */}
                <div className="info-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#94a3b8' }}>business</span>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Company Name</label>
                    </div>
                    {isEditing ? (
                        /* [VISUAL STATE]: Edit Mode. Input field active. */
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={onInputChange}
                            className="profile-input"
                        />
                    ) : (
                        /* [VISUAL STATE]: View Mode. Display text. */
                        <p style={{ fontSize: '1rem', color: '#1a1a1a', fontWeight: 500, margin: 0, paddingLeft: 'calc(18px + 0.5rem)' }}>
                            {user?.companyName || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>Not specified</span>}
                        </p>
                    )}
                </div>

                {/* Location Inputs (City & State) */}
                <div className="info-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#94a3b8' }}>location_on</span>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Location</label>
                    </div>
                    {isEditing ? (
                        /* [VISUAL STATE]: Edit Mode. Two inputs for City/State. */
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={onInputChange}
                                className="profile-input"
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={onInputChange}
                                className="profile-input"
                            />
                        </div>
                    ) : (
                        /* [VISUAL STATE]: View Mode. Combined location string. */
                        <p style={{ fontSize: '1rem', color: '#1a1a1a', fontWeight: 500, margin: 0, paddingLeft: 'calc(18px + 0.5rem)' }}>
                            {(user?.city || user?.state) ? `${user.city || ''}${user.city && user.state ? ', ' : ''}${user.state || ''}` : <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>Not specified</span>}
                        </p>
                    )}
                </div>

                {/* Website Input */}
                <div className="info-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#94a3b8' }}>language</span>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Website</label>
                    </div>
                    {isEditing ? (
                        /* [VISUAL STATE]: Edit Mode. Input field active. */
                        <input
                            type="text"
                            name="companyWebsite"
                            placeholder="https://..."
                            value={formData.companyWebsite}
                            onChange={onInputChange}
                            className="profile-input"
                        />
                    ) : (
                        /* [VISUAL STATE]: View Mode. Display text. */
                        <p style={{ fontSize: '1rem', color: '#1a1a1a', fontWeight: 500, margin: 0, paddingLeft: 'calc(18px + 0.5rem)' }}>
                            {user?.companyWebsite || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>Not provided</span>}
                        </p>
                    )}
                </div>

                {/* Company Description Textarea (Full Width) */}
                <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#94a3b8' }}>description</span>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Company Description</label>
                    </div>
                    <div style={{ paddingLeft: isEditing ? 0 : 'calc(18px + 0.5rem)' }}>
                        {isEditing ? (
                            /* [VISUAL STATE]: Edit Mode. Textarea active. */
                            <textarea
                                name="companyDescription"
                                rows={4}
                                value={formData.companyDescription}
                                onChange={onInputChange}
                                className="profile-input"
                                style={{ minHeight: '100px', resize: 'vertical' }}
                            />
                        ) : (
                            /* [VISUAL STATE]: View Mode. Display paragraph text. */
                            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: 0, color: '#334155' }}>
                                {user?.companyDescription || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>No description provided.</span>}
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PersonalProfileDetails;
