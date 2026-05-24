// Component: CompanyHeader
// Purpose: Top banner displaying company logo, name, verified status, and profile completion with Edit Profile button.
import React from 'react';
import type { RecruiterProfileData } from '@/hooks/profile/recruiter/useRecruiterProfile';

interface CompanyHeaderProps {
    data: RecruiterProfileData;
    onEdit: () => void;
    isEditing?: boolean;
    isSaving?: boolean;
    onSave?: (updates: Partial<RecruiterProfileData>) => void;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ data, onEdit, isEditing, isSaving, onSave }) => {
    const [tempData, setTempData] = React.useState({
        companyName: data.companyName,
        professionalTitle: data.professionalTitle
    });

    // Sync temp state when data changes and we are not editing
    React.useEffect(() => {
        if (!isEditing) {
            setTempData({
                companyName: data.companyName,
                professionalTitle: data.professionalTitle
            });
        }
    }, [data.companyName, data.professionalTitle, isEditing]);

    const handleHeaderSave = () => {
        if (onSave) {
            onSave({
                companyName: tempData.companyName,
                professionalTitle: tempData.professionalTitle
            });
        }
    };

    return (
        <div className="profile-card company-header-card">
            {/* Header Top: Logo & Company Info */}
            <div className="header-top">
                {/* Company Logo - Dark Teal Square */}
                <div
                    className="company-logo-large"
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0d5454',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        flexShrink: 0
                    }}
                >
                    <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
                        <div style={{ fontSize: '10px', opacity: 0.8 }}>©️</div>
                        <div>TECHFLOW</div>
                    </div>
                </div>

                {/* Company Details */}
                <div className="company-info flex-1">
                    {isEditing ? (
                        <div className="flex flex-col gap-3 max-w-[400px]">
                            <input
                                className="profile-input font-bold"
                                style={{ fontSize: '1.5rem', padding: '0.4rem 0.8rem' }}
                                value={tempData.companyName}
                                onChange={(e) => setTempData({ ...tempData, companyName: e.target.value })}
                            />
                            <input
                                className="profile-input"
                                placeholder="Your Title (e.g. HR Head)"
                                value={tempData.professionalTitle}
                                onChange={(e) => setTempData({ ...tempData, professionalTitle: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <button className="btn-save-inline" onClick={handleHeaderSave} disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Header'}
                                </button>
                                <button className="btn-edit-profile" style={{ marginTop: 0, padding: '0.4rem 1rem' }} onClick={onEdit} disabled={isSaving}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px', color: '#1a1a1a' }}>
                                {data.companyName}
                            </h1>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                                {data.tagline}
                            </p>
                            {data.isVerified && (
                                <div className="verified-badge" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#EBF5FF',
                                    color: '#2D72FF',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 600
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                                    VERIFIED EMPLOYER
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Profile Completion Section */}
            <div className="completion-bar-container" style={{ marginTop: '24px' }}>
                <div className="completion-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                }}>
                    <span style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#64748b'
                    }}>
                        Profile Completion
                    </span>
                    <span style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#2D72FF'
                    }}>
                        {data.completionPercentage}%
                    </span>
                </div>

                {/* Progress Bar */}
                <div style={{
                    height: '8px',
                    background: '#E5E7EB',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginBottom: '16px'
                }}>
                    <div
                        style={{
                            width: `${data.completionPercentage}%`,
                            height: '100%',
                            background: '#2D72FF',
                            transition: 'width 0.5s ease'
                        }}
                    />
                </div>

                {/* Edit Profile Button - Full Width */}
                {!isEditing && (
                    <button
                        className="btn-edit-profile-main"
                        onClick={onEdit}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#2D72FF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D5FE8'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2D72FF'}
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default CompanyHeader;
