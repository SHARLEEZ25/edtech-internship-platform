import React from 'react';
import { createPortal } from 'react-dom';

interface ProfileHeaderProps {
    user: any;
    strength: number;
    primaryRole: string;
    isEditingRole: boolean;
    isSaving?: boolean;
    onEditRole: () => void;
    onSaveRole: () => void;
    onRoleChange: (val: string) => void;
    onSaveBasic: (fields: any) => Promise<void>;
    error?: string | null;
    readOnly?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    user, strength, primaryRole, isEditingRole, isSaving, onEditRole, onSaveRole, onRoleChange, onSaveBasic, error, readOnly = false
}) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (strength / 100) * circumference;

    const [isEditingMeta, setIsEditingMeta] = React.useState(false);
    const [metaData, setMetaData] = React.useState({
        degree: user?.degree || '',
        specialization: user?.specialization || '',
        collegeName: user?.collegeName || '',
        city: user?.city || '',
        state: user?.state || '',
        linkedinUrl: user?.linkedinUrl || '',
        githubUrl: user?.githubUrl || '',
        portfolioUrl: user?.portfolioUrl || ''
    });

    const handleSaveMeta = async () => {
        await onSaveBasic(metaData);
        setIsEditingMeta(false);
    };

    React.useEffect(() => {
        setMetaData({
            degree: user?.degree || '',
            specialization: user?.specialization || '',
            collegeName: user?.collegeName || '',
            city: user?.city || '',
            state: user?.state || '',
            linkedinUrl: user?.linkedinUrl || '',
            githubUrl: user?.githubUrl || '',
            portfolioUrl: user?.portfolioUrl || ''
        });
    }, [user]);

    return (
        <div className="profile-card profile-header-card animate-fade-in" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2rem',
            gap: '2rem'
        }}>
            {/* Left: Avatar with online status */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
                <div
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        backgroundImage: `url('${user?.profilePictureUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC9Itld376700jjjrgL2a7TkB7NDsvVj0pJ3Blrv5MlFKT2Mblarp96n4xb8gyZtu8GNGWDtvyyOsGX2Mwg7rJyx1KcTlmu4rD6MRLYPRU64N7qjuS6usVldJKrV-g5OmqoiODQEoMusN0SYAaoBjNC8C7cRCLt6sgdv6gREOJDkVXrQt6D4gpRW_kgP5WjPIlVtyOFJzGcTPAnGibO6AA4x-bdB678Ix1nrYm_Ttm3h6hJqRyV4Ksridng7-rsIMl2R0k8PssB48'}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '3px solid white',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                />
                {/* Online status indicator */}
                <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    border: '3px solid white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }} />
            </div>

            {/* Center: User Info */}
            <div style={{ flex: 1 }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    margin: '0 0 0.5rem 0'
                }}>
                    {user?.fullName || 'Student Name'}
                </h1>

                {/* Location */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    marginBottom: '0.625rem'
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: '#94a3b8' }}>
                        location_on
                    </span>
                    <span style={{
                        fontSize: '0.9375rem',
                        color: '#94a3b8'
                    }}>
                        {user?.city ? `${user.city}, ${user.state || 'India'}` : 'Bangalore, India'}
                    </span>
                </div>

                {/* Role */}
                {isEditingRole ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {error && <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 500 }}>{error}</div>}
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <input
                                className="bio-textarea"
                                style={{
                                    minHeight: 'auto',
                                    padding: '0.6rem 1rem',
                                    width: '300px'
                                }}
                                value={primaryRole}
                                onChange={(e) => onRoleChange(e.target.value)}
                                placeholder="e.g. Full Stack Developer"
                                autoFocus
                            />
                            <button className="save-profile-btn" style={{ marginTop: 0, padding: '0.6rem 1.5rem' }} onClick={onSaveRole}>Save</button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={!readOnly ? onEditRole : undefined}
                        style={{
                            cursor: !readOnly ? 'pointer' : 'default',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <span style={{
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: '#2D72FF'
                        }}>
                            {primaryRole || "Add your professional role"}
                        </span>
                        {!readOnly && <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', opacity: 0.5, color: '#2D72FF' }}>edit_square</span>}
                    </div>
                )}
            </div>

            {/* Right: Profile Strength */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                flexShrink: 0
            }}>
                <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                    <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <circle
                            cx="45"
                            cy="45"
                            r={radius}
                            fill="none"
                            stroke="#e9ecef"
                            strokeWidth="8"
                        />
                        <circle
                            cx="45"
                            cy="45"
                            r={radius}
                            fill="none"
                            stroke="#2D72FF"
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                    </svg>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#1a1a1a'
                    }}>
                        {strength}%
                    </div>
                </div>
                <div style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#94a3b8'
                }}>
                    Strength
                </div>
            </div>

            {/* Hidden Modal for Editing Basic Info & Socials */}
            {isEditingMeta && createPortal(
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '2rem'
                }} onClick={() => setIsEditingMeta(false)}>
                    <div
                        className="profile-card animate-fade-in"
                        style={{
                            width: '100%',
                            maxWidth: '650px',
                            background: 'white',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            position: 'relative',
                            padding: '2.5rem',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(0,0,0,0.1)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="section-header">
                            <h2 className="section-title">Edit Basic Info & Socials</h2>
                            <button className="edit-btn" onClick={() => setIsEditingMeta(false)} style={{ background: 'none', padding: '0.5rem', border: 'none' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="experience-form" style={{ background: 'transparent', border: 'none', padding: 0, marginBottom: 0 }}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>College Name</label>
                                    <input type="text" value={metaData.collegeName} onChange={e => setMetaData({ ...metaData, collegeName: e.target.value })} placeholder="Enter your college" />
                                </div>
                                <div className="form-group">
                                    <label>Degree</label>
                                    <input type="text" value={metaData.degree} onChange={e => setMetaData({ ...metaData, degree: e.target.value })} placeholder="e.g. B.Tech" />
                                </div>
                                <div className="form-group">
                                    <label>Specialization</label>
                                    <input type="text" value={metaData.specialization} onChange={e => setMetaData({ ...metaData, specialization: e.target.value })} placeholder="e.g. Computer Science" />
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" value={metaData.city} onChange={e => setMetaData({ ...metaData, city: e.target.value })} placeholder="e.g. Chennai" />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input type="text" value={metaData.state} onChange={e => setMetaData({ ...metaData, state: e.target.value })} placeholder="e.g. TN" />
                                </div>
                                <div className="form-group">
                                    <label>LinkedIn URL</label>
                                    <input type="text" value={metaData.linkedinUrl} onChange={e => setMetaData({ ...metaData, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." />
                                </div>
                                <div className="form-group">
                                    <label>GitHub URL</label>
                                    <input type="text" value={metaData.githubUrl} onChange={e => setMetaData({ ...metaData, githubUrl: e.target.value })} placeholder="https://github.com/..." />
                                </div>
                                <div className="form-group">
                                    <label>Portfolio URL</label>
                                    <input type="text" value={metaData.portfolioUrl} onChange={e => setMetaData({ ...metaData, portfolioUrl: e.target.value })} placeholder="https://yourportfolio.com" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                                <button className="save-profile-btn" style={{ marginTop: 0, flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={handleSaveMeta} disabled={isSaving}>
                                    {isSaving && <span className="material-symbols-outlined spin" style={{ fontSize: '1.25rem' }}>progress_activity</span>}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button className="edit-btn" style={{ flex: 1 }} onClick={() => setIsEditingMeta(false)} disabled={isSaving}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
