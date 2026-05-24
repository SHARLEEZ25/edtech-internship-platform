import React from 'react';

interface ProfileBioProps {
    bio: string;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onChange: (val: string) => void;
    error?: string | null;
    readOnly?: boolean;
}

export const ProfileBio: React.FC<ProfileBioProps> = ({ bio, isEditing, onEdit, onSave, onChange, error, readOnly = false }) => (
    <div className="profile-card animate-fade-in">
        <div className="info-section-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>About Me</h3>
            {!readOnly && !isEditing && (
                <button
                    onClick={onEdit}
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
            <div className="animate-fade-in">
                {error && (
                    <div style={{
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                        fontWeight: 500,
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(239, 68, 68, 0.05)',
                        borderRadius: '6px',
                        borderLeft: '3px solid #ef4444'
                    }}>
                        {error}
                    </div>
                )}
                <div className="experience-form" style={{ padding: '0', background: 'transparent', border: 'none', marginBottom: '1rem' }}>
                    <div className="form-group">
                        <textarea
                            value={bio}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </div>
                <button className="save-profile-btn" onClick={onSave} style={{ marginTop: 0 }}>Update Profile</button>
            </div>
        ) : (
            <div style={{
                background: '#f8f9fa',
                padding: '1.25rem',
                borderRadius: '24px',
                border: '1px solid #e9ecef'
            }}>
                <p style={{
                    fontSize: '0.9375rem',
                    lineHeight: '1.7',
                    color: '#64748b',
                    margin: 0
                }}>
                    {bio || 'No bio added yet.'}
                </p>
            </div>
        )}
    </div>
);
