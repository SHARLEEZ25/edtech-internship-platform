import React, { useState } from 'react';
import { type RecruiterProfileData } from '@/hooks/profile/recruiter/useRecruiterProfile';

interface RecruiterProfileVisualsProps {
    profileData: RecruiterProfileData;
    isRefreshing: boolean;
    editingSection: string | null;
    handleEditToggle: (section: string | null) => void;
    updateBasicProfile: (updates: any) => Promise<void>;
    updateEngagement: (id: string, updates: any) => Promise<void>;
    addAchievement: (data: any) => Promise<void>;
    deleteAchievement: (id: string) => Promise<void>;
    addEngagement: (data: any) => Promise<void>;
    deleteEngagement: (id: string) => Promise<void>;
}

export const RecruiterProfileVisuals: React.FC<RecruiterProfileVisualsProps> = ({
    profileData,
    isRefreshing: _isRefreshing,
    editingSection,
    handleEditToggle,
    updateBasicProfile,
    addAchievement,
    deleteAchievement: _deleteAchievement,
    addEngagement,
    deleteEngagement,
    updateEngagement
}) => {
    // Helper to render icons
    const Icon = ({ name, className = '' }: { name: string, className?: string }) => (
        <span className={`material-symbols-outlined ${className}`}>{name}</span>
    );

    // --- State for Adding Achievement ---
    const [newAch, setNewAch] = useState({ label: '', icon: 'military_tech', colorClass: 'gold' });
    const ICONS = ['military_tech', 'handshake', 'diversity_3', 'lightbulb', 'stars', 'workspace_premium', 'bolt', 'favorite'];
    const COLORS = ['gold', 'purple', 'cyan', 'blue', 'orange', 'green'];

    // --- State for Editing Company Header ---
    const [headerEdit, setHeaderEdit] = useState({
        companyName: profileData.companyName,
        businessType: profileData.businessType || '',
        location: profileData.location,
        recruiterName: profileData.recruiterName,
        professionalTitle: profileData.professionalTitle
    });

    // Sync header edit state when profileData changes or when entering edit mode
    React.useEffect(() => {
        if (editingSection === 'company-header') {
            setHeaderEdit({
                companyName: profileData.companyName,
                businessType: profileData.businessType || '',
                location: profileData.location,
                recruiterName: profileData.recruiterName,
                professionalTitle: profileData.professionalTitle
            });
        }
    }, [editingSection, profileData]);

    const handleSaveHeader = async () => {
        const { recruiterName, ...rest } = headerEdit;
        await updateBasicProfile({ ...rest, fullName: recruiterName });
        handleEditToggle(null);
    };

    // --- State for Editing About Company ---
    const [aboutEdit, setAboutEdit] = useState(profileData.about);

    React.useEffect(() => {
        if (editingSection === 'about-company') {
            setAboutEdit(profileData.about);
        }
    }, [editingSection, profileData.about]);

    const handleSaveAbout = async () => {
        await updateBasicProfile({ companyDescription: aboutEdit });
        handleEditToggle(null);
    };

    // --- State for Editing Hiring Stats ---
    const [statsEdit, setStatsEdit] = useState({
        studentsHired: profileData.stats.studentsHired,
        activePostings: profileData.stats.activePostings,
        retentionRate: profileData.stats.retentionRate
    });

    React.useEffect(() => {
        if (editingSection === 'hiring-stats') {
            setStatsEdit({
                studentsHired: profileData.stats.studentsHired,
                activePostings: profileData.stats.activePostings,
                retentionRate: profileData.stats.retentionRate
            });
        }
    }, [editingSection, profileData.stats]);

    const handleSaveStats = async () => {
        await updateBasicProfile({ ...statsEdit });
        handleEditToggle(null);
    };

    // --- State for Editing Headquarters ---
    const [hqEdit, setHqEdit] = useState({
        address: profileData.headquarters.address,
        city: profileData.headquarters.city || '',
        state: profileData.headquarters.state || ''
    });

    React.useEffect(() => {
        if (editingSection === 'headquarters') {
            setHqEdit({
                address: profileData.headquarters.address,
                city: profileData.headquarters.city || '',
                state: profileData.headquarters.state || ''
            });
        }
    }, [editingSection, profileData.headquarters]);

    const handleSaveHQ = async () => {
        await updateBasicProfile({ address: hqEdit.address, city: hqEdit.city, state: hqEdit.state });
        handleEditToggle(null);
    };

    // --- State for Editing Hiring Roles ---
    const [rolesEdit, setRolesEdit] = useState(profileData.hiringRoles || []);
    const [newRole, setNewRole] = useState('');

    React.useEffect(() => {
        if (editingSection === 'hiring-roles') {
            setRolesEdit(profileData.hiringRoles || []);
            setNewRole('');
        }
    }, [editingSection, profileData.hiringRoles]);

    const handleAddRole = () => {
        if (newRole.trim()) {
            setRolesEdit([...rolesEdit, newRole.trim()]);
            setNewRole('');
        }
    };

    const handleRemoveRole = (index: number) => {
        setRolesEdit(rolesEdit.filter((_, i) => i !== index));
    };

    const handleSaveRoles = async () => {
        await updateBasicProfile({ hiringRoles: rolesEdit });
        handleEditToggle(null);
    };

    // --- State for Adding Engagement ---
    const [newEngagement, setNewEngagement] = useState({
        title: '',
        location: '',
        date: '',
        status: 'upcoming',
        icon: 'campaign',
        iconColor: 'orange'
    });

    const ENGAGEMENT_ICONS = ['campaign', 'code', 'school', 'groups', 'event', 'mic', 'workspace_premium'];
    const ENGAGEMENT_COLORS = ['orange', 'blue', 'purple', 'green', 'cyan'];
    const ENGAGEMENT_STATUSES = ['upcoming', 'completed', 'ongoing'];

    const handleSaveEngagement = async () => {
        if (!newEngagement.title || !newEngagement.location || !newEngagement.date) return;
        await addEngagement(newEngagement);
        setNewEngagement({ title: '', location: '', date: '', status: 'upcoming', icon: 'campaign', iconColor: 'orange' });
        handleEditToggle(null);
    };

    // --- State for Editing Existing Engagement ---
    const [editingEngagementIndex, setEditingEngagementIndex] = useState<number | null>(null);
    const [editedEngagement, setEditedEngagement] = useState<any>(null);

    const handleEditEngagement = (index: number, engagement: any) => {
        setEditingEngagementIndex(index);
        setEditedEngagement({ ...engagement });
    };

    const handleSaveEditedEngagement = async () => {
        if (editedEngagement && editingEngagementIndex !== null) {
            // Update the engagement individually
            const { id, ...updates } = editedEngagement;
            if (id) {
                await updateEngagement(id, updates);
            }
            setEditingEngagementIndex(null);
            setEditedEngagement(null);
        }
    };

    const handleCancelEditEngagement = () => {
        setEditingEngagementIndex(null);
        setEditedEngagement(null);
    };

    const handleSaveAch = async () => {
        if (!newAch.label) return;
        await addAchievement(newAch);
        setNewAch({ label: '', icon: 'military_tech', colorClass: 'gold' });
        handleEditToggle(null);
    };

    return (
        <div className="profile-visuals-wrapper animate-fade-in">
            {/* --- 1. Top Card: Company Header --- */}
            <div className="profile-card company-header-card">
                <div className="header-top-row">
                    <div className="company-logo-wrapper">
                        {/* Square Logo with Dark Background */}
                        <div className="company-logo-inner">
                            <Icon name="flow" className="text-3xl" />
                            <span className="logo-text-small">TEHFLOW</span>
                        </div>
                    </div>

                    {editingSection === 'company-header' ? (
                        // Edit Mode
                        <div className="header-company-info">
                            <input
                                type="text"
                                className="profile-input"
                                style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', padding: '0.5rem' }}
                                value={headerEdit.companyName}
                                onChange={(e) => setHeaderEdit({ ...headerEdit, companyName: e.target.value })}
                                placeholder="Company Name"
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <input
                                    type="text"
                                    className="profile-input"
                                    style={{ flex: 1, padding: '0.5rem' }}
                                    value={headerEdit.businessType}
                                    onChange={(e) => setHeaderEdit({ ...headerEdit, businessType: e.target.value })}
                                    placeholder="Business Type (e.g., Product-based SaaS)"
                                />
                                <input
                                    type="text"
                                    className="profile-input"
                                    style={{ flex: 1, padding: '0.5rem' }}
                                    value={headerEdit.location}
                                    onChange={(e) => setHeaderEdit({ ...headerEdit, location: e.target.value })}
                                    placeholder="Location"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <input
                                    type="text"
                                    className="profile-input"
                                    style={{ flex: 1, padding: '0.5rem' }}
                                    value={headerEdit.recruiterName}
                                    onChange={(e) => setHeaderEdit({ ...headerEdit, recruiterName: e.target.value })}
                                    placeholder="Your Name"
                                />
                                <input
                                    type="text"
                                    className="profile-input"
                                    style={{ flex: 1, padding: '0.5rem' }}
                                    value={headerEdit.professionalTitle}
                                    onChange={(e) => setHeaderEdit({ ...headerEdit, professionalTitle: e.target.value })}
                                    placeholder="Your Title (e.g., HR Manager)"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    className="btn-save-inline"
                                    onClick={handleSaveHeader}
                                    style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Save Changes
                                </button>
                                <button
                                    className="btn-edit-profile"
                                    onClick={() => handleEditToggle(null)}
                                    style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        // View Mode
                        <div className="header-company-info">
                            <h1 className="header-company-name">{profileData.companyName || 'TechFlow Solutions'}</h1>
                            <div className="header-company-meta">
                                <span>{profileData.businessType || 'Product-based SaaS'}</span>
                                <span className="dot">•</span>
                                <span>{profileData.location || 'Bangalore, India'}</span>
                            </div>

                            {(profileData.recruiterName || profileData.professionalTitle) && (
                                <div className="header-manager-info" style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>person_outline</span>
                                    <span>
                                        Managed by <span style={{ color: '#0f172a', fontWeight: 600 }}>{profileData.recruiterName}</span>
                                        {profileData.recruiterName && profileData.professionalTitle && <span style={{ margin: '0 0.25rem', color: '#cbd5e1' }}>|</span>}
                                        {profileData.professionalTitle}
                                    </span>
                                </div>
                            )}
                            <div className="verified-badge">
                                <Icon name="verified" className="badge-icon-filled" />
                                VERIFIED EMPLOYER
                            </div>
                        </div>
                    )}

                    {editingSection !== 'company-header' && (
                        <button
                            className="btn-edit-profile-action header-edit-btn"
                            onClick={() => handleEditToggle('company-header')}
                        >
                            <Icon name="edit" className="icon-sm" />
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="completion-section">
                    <div className="completion-header">
                        <span>Profile Completion</span>
                        <span className="completion-percent">85%</span>
                    </div>
                    <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: '85%' }}></div>
                    </div>
                </div>
            </div>

            {/* --- 2. Grid Layout --- */}
            <div className="profile-details-grid">

                {/* Left Column */}
                <div className="left-column">
                    {/* About Company */}
                    <div className="profile-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className="section-header-row" style={{ marginBottom: 0 }}>
                                <div className="icon-circle-bg blue">
                                    <Icon name="info" />
                                </div>
                                About Company
                            </h3>
                            {editingSection !== 'about-company' && (
                                <button
                                    className="btn-edit-inline"
                                    onClick={() => handleEditToggle('about-company')}
                                    style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                >
                                    <Icon name="edit" className="icon-sm" />
                                    Edit
                                </button>
                            )}
                        </div>

                        {editingSection === 'about-company' ? (
                            // Edit Mode
                            <div className="animate-fade-in">
                                <textarea
                                    className="profile-input"
                                    style={{ width: '100%', minHeight: '150px', padding: '0.75rem', fontSize: '0.95rem', lineHeight: '1.6', border: '1px solid #e2e8f0', borderRadius: '0.5rem', resize: 'vertical' }}
                                    value={aboutEdit}
                                    onChange={(e) => setAboutEdit(e.target.value)}
                                    placeholder="Describe your company, mission, culture, and what makes you unique..."
                                />
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                    <button
                                        className="btn-save-inline"
                                        onClick={handleSaveAbout}
                                        style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn-edit-profile"
                                        onClick={() => handleEditToggle(null)}
                                        style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div className="about-content">
                                <p>
                                    {profileData.about || `TechFlow Solutions is a leading product-based SaaS company focused on building
                                    innovative cloud infrastructure. Our mission is to empower developers worldwide
                                    through seamless automation and scalable architecture.`}
                                </p>
                                <p>
                                    We foster a culture of continuous learning, inclusivity, and technical excellence.
                                    With a global team of over 200 engineers, we are redefining how enterprises manage their
                                    hybrid-cloud deployments.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Hiring Experience */}
                    <div className="profile-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className="section-header-no-icon" style={{ marginBottom: 0 }}>Hiring Experience</h3>
                            {editingSection !== 'hiring-stats' && (
                                <button
                                    className="btn-edit-inline"
                                    onClick={() => handleEditToggle('hiring-stats')}
                                    style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                >
                                    <Icon name="edit" className="icon-sm" />
                                    Edit
                                </button>
                            )}
                        </div>

                        {editingSection === 'hiring-stats' ? (
                            // Edit Mode
                            <div className="animate-fade-in">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Students Hired</label>
                                        <input
                                            type="number"
                                            className="profile-input"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                                            value={statsEdit.studentsHired}
                                            onChange={(e) => setStatsEdit({ ...statsEdit, studentsHired: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Active Postings</label>
                                        <input
                                            type="number"
                                            className="profile-input"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                                            value={statsEdit.activePostings}
                                            onChange={(e) => setStatsEdit({ ...statsEdit, activePostings: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Retention Rate (%)</label>
                                        <input
                                            type="number"
                                            className="profile-input"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                                            value={statsEdit.retentionRate}
                                            onChange={(e) => setStatsEdit({ ...statsEdit, retentionRate: parseInt(e.target.value) || 0 })}
                                            max="100"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                    <button
                                        className="btn-save-inline"
                                        onClick={handleSaveStats}
                                        style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn-edit-profile"
                                        onClick={() => handleEditToggle(null)}
                                        style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div className="experience-stats-row">
                                <div className="exp-stat-pill">
                                    <span className="exp-value">{profileData.stats.studentsHired}+</span>
                                    <span className="exp-label">STUDENTS HIRED</span>
                                </div>
                                <div className="exp-stat-pill">
                                    <span className="exp-value">{profileData.stats.activePostings}</span>
                                    <span className="exp-label">ACTIVE POSTINGS</span>
                                </div>
                                <div className="exp-stat-pill">
                                    <span className="exp-value">{profileData.stats.retentionRate}%</span>
                                    <span className="exp-label">RETENTION RATE</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Engagements */}
                    <div className="profile-card">
                        <div className="section-header-with-action">
                            <h3 className="section-title-simple">Engagements</h3>
                            {editingSection !== 'engagements' ? (
                                <button
                                    className="text-link-button"
                                    onClick={() => handleEditToggle('engagements')}
                                    style={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}
                                >
                                    + Add New
                                </button>
                            ) : (
                                <button className="text-link-button">View All</button>
                            )}
                        </div>

                        {editingSection === 'engagements' ? (
                            // Add Engagement Form
                            <div className="animate-fade-in" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', marginTop: '1rem' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Engagement</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Event Title</label>
                                        <input
                                            type="text"
                                            className="profile-input"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                                            value={newEngagement.title}
                                            onChange={(e) => setNewEngagement({ ...newEngagement, title: e.target.value })}
                                            placeholder="e.g., Campus Tech Talk 2024"
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Location</label>
                                            <input
                                                type="text"
                                                className="profile-input"
                                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                                                value={newEngagement.location}
                                                onChange={(e) => setNewEngagement({ ...newEngagement, location: e.target.value })}
                                                placeholder="e.g., IIT Bangalore"
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Date</label>
                                            <input
                                                type="text"
                                                className="profile-input"
                                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                                                value={newEngagement.date}
                                                onChange={(e) => setNewEngagement({ ...newEngagement, date: e.target.value })}
                                                placeholder="e.g., March 15th"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Status</label>
                                        <select
                                            className="profile-input"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                                            value={newEngagement.status}
                                            onChange={(e) => setNewEngagement({ ...newEngagement, status: e.target.value })}
                                        >
                                            {ENGAGEMENT_STATUSES.map(status => (
                                                <option key={status} value={status}>{status.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Icon</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {ENGAGEMENT_ICONS.map(icon => (
                                                <button
                                                    key={icon}
                                                    onClick={() => setNewEngagement({ ...newEngagement, icon })}
                                                    style={{
                                                        padding: '0.5rem',
                                                        borderRadius: '50%',
                                                        border: newEngagement.icon === icon ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                                        background: newEngagement.icon === icon ? '#eff6ff' : 'white',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Icon name={icon} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Icon Color</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {ENGAGEMENT_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setNewEngagement({ ...newEngagement, iconColor: color })}
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        border: newEngagement.iconColor === color ? '3px solid #3b82f6' : '2px solid #e2e8f0',
                                                        cursor: 'pointer',
                                                        position: 'relative'
                                                    }}
                                                    className={`engagement-icon-box ${color}`}
                                                >
                                                    {newEngagement.iconColor === color && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '1.25rem' }}>✓</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                    <button
                                        className="btn-save-inline"
                                        onClick={handleSaveEngagement}
                                        style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Add Engagement
                                    </button>
                                    <button
                                        className="btn-edit-profile"
                                        onClick={() => handleEditToggle(null)}
                                        style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        <div className="engagements-list">
                            {profileData.engagements && profileData.engagements.length > 0 ? (
                                profileData.engagements.map((engagement: any, index: number) => (
                                    <div key={index} className="engagement-row" style={{ position: 'relative', flexDirection: 'column', alignItems: 'stretch', padding: editingEngagementIndex === index ? '0' : undefined }}>
                                        {editingEngagementIndex === index && editedEngagement ? (
                                            // Edit Mode
                                            <div className="animate-fade-in" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                                                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>Edit Engagement</h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <input type="text" className="profile-input" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem' }} value={editedEngagement.title} onChange={(e) => setEditedEngagement({ ...editedEngagement, title: e.target.value })} placeholder="Event Title" />
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <input type="text" className="profile-input" style={{ flex: 1, padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem' }} value={editedEngagement.location} onChange={(e) => setEditedEngagement({ ...editedEngagement, location: e.target.value })} placeholder="Location" />
                                                        <input type="text" className="profile-input" style={{ flex: 1, padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem' }} value={editedEngagement.date} onChange={(e) => setEditedEngagement({ ...editedEngagement, date: e.target.value })} placeholder="Date" />
                                                    </div>
                                                    <select className="profile-input" style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem' }} value={editedEngagement.status} onChange={(e) => setEditedEngagement({ ...editedEngagement, status: e.target.value })}>
                                                        {ENGAGEMENT_STATUSES.map(status => <option key={status} value={status}>{status.toUpperCase()}</option>)}
                                                    </select>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.375rem' }}>Icon</label>
                                                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                                                            {ENGAGEMENT_ICONS.map(icon => <button key={icon} onClick={() => setEditedEngagement({ ...editedEngagement, icon })} style={{ padding: '0.375rem', borderRadius: '50%', border: editedEngagement.icon === icon ? '2px solid #3b82f6' : '1px solid #e2e8f0', background: editedEngagement.icon === icon ? '#eff6ff' : 'white', cursor: 'pointer', fontSize: '0.875rem' }}><Icon name={icon} /></button>)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.375rem' }}>Color</label>
                                                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                                                            {ENGAGEMENT_COLORS.map(color => <button key={color} onClick={() => setEditedEngagement({ ...editedEngagement, iconColor: color })} style={{ width: '32px', height: '32px', borderRadius: '50%', border: editedEngagement.iconColor === color ? '3px solid #3b82f6' : '2px solid #e2e8f0', cursor: 'pointer', position: 'relative' }} className={`engagement-icon-box ${color}`}>{editedEngagement.iconColor === color && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '1rem' }}>✓</span>}</button>)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                                    <button onClick={handleSaveEditedEngagement} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>Save</button>
                                                    <button onClick={handleCancelEditEngagement} style={{ padding: '0.5rem 1rem', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            // View Mode
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                <div className="engagement-left">
                                                    <div className={`engagement-icon-box ${engagement.iconColor || 'orange'}`}>
                                                        <Icon name={engagement.icon || 'campaign'} />
                                                    </div>
                                                    <div className="engagement-info">
                                                        <h4>{engagement.title}</h4>
                                                        <p>{engagement.location} • {engagement.date}</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span className={`badge-status ${engagement.status || 'upcoming'}`}>{(engagement.status || 'upcoming').toUpperCase()}</span>
                                                    <button onClick={() => handleEditEngagement(index, engagement)} style={{ background: 'none', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontWeight: 600 }} title="Edit engagement">Edit</button>
                                                    {deleteEngagement && <button onClick={() => deleteEngagement(engagement.id || index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '0.25rem', borderRadius: '0.25rem' }} title="Delete engagement">×</button>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="engagement-row">
                                        <div className="engagement-left">
                                            <div className="engagement-icon-box orange">
                                                <Icon name="campaign" />
                                            </div>
                                            <div className="engagement-info">
                                                <h4>Campus Tech Talk 2024</h4>
                                                <p>IIT Bangalore • March 15th</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span className="badge-status upcoming">UPCOMING</span>
                                            <button onClick={() => handleEditEngagement(0, { title: 'Campus Tech Talk 2024', location: 'IIT Bangalore', date: 'March 15th', status: 'upcoming', icon: 'campaign', iconColor: 'orange' })} style={{ background: 'none', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontWeight: 600 }} title="Edit engagement">Edit</button>
                                            {deleteEngagement && <button onClick={() => deleteEngagement('0')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '0.25rem', borderRadius: '0.25rem' }} title="Delete engagement">×</button>}
                                        </div>
                                    </div>

                                    <div className="engagement-row">
                                        <div className="engagement-left">
                                            <div className="engagement-icon-box blue">
                                                <Icon name="code" />
                                            </div>
                                            <div className="engagement-info">
                                                <h4>Fullstack Workshop</h4>
                                                <p>Online • Feb 22nd</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span className="badge-status completed">COMPLETED</span>
                                            <button onClick={() => handleEditEngagement(1, { title: 'Fullstack Workshop', location: 'Online', date: 'Feb 22nd', status: 'completed', icon: 'code', iconColor: 'blue' })} style={{ background: 'none', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontWeight: 600 }} title="Edit engagement">Edit</button>
                                            {deleteEngagement && <button onClick={() => deleteEngagement('1')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '0.25rem', borderRadius: '0.25rem' }} title="Delete engagement">×</button>}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column">
                    {/* Other Hiring Roles */}
                    <div className="profile-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className="section-title-simple" style={{ marginBottom: 0 }}>Other Hiring Roles</h3>
                            {editingSection !== 'hiring-roles' && (
                                <button
                                    className="btn-edit-inline"
                                    onClick={() => handleEditToggle('hiring-roles')}
                                    style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                >
                                    <Icon name="edit" className="icon-sm" />
                                    Edit
                                </button>
                            )}
                        </div>

                        {editingSection === 'hiring-roles' ? (
                            // Edit Mode
                            <div className="animate-fade-in">
                                <div className="tags-container" style={{ marginBottom: '1rem' }}>
                                    {rolesEdit.map((role, index) => (
                                        <span key={index} className="role-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', paddingRight: '0.5rem' }}>
                                            {role}
                                            <button
                                                onClick={() => handleRemoveRole(index)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1, padding: 0 }}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <input
                                        type="text"
                                        className="profile-input"
                                        style={{ flex: 1, padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddRole()}
                                        placeholder="Add a new role (e.g., UI Intern)"
                                    />
                                    <button
                                        onClick={handleAddRole}
                                        style={{ padding: '0.75rem 1.25rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        className="btn-save-inline"
                                        onClick={handleSaveRoles}
                                        style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn-edit-profile"
                                        onClick={() => handleEditToggle(null)}
                                        style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div className="tags-container">
                                {(profileData.hiringRoles || ['UI Intern', 'Backend Intern', 'Data Analyst', 'Cloud Ops', 'Marketing']).map((role, index) => (
                                    <span key={index} className="role-tag">{role}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Achievements */}
                    <div className="profile-card">
                        <h3 className="section-title-simple">Achievements</h3>

                        {editingSection === 'achievements' ? (
                            <div className="add-achievement-form animate-fade-in" style={{ padding: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="LABEL (e.g. TOP HIRER)"
                                    className="profile-input"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        fontSize: '0.9rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.5rem',
                                        marginBottom: '1rem',
                                        outline: 'none'
                                    }}
                                    value={newAch.label}
                                    onChange={(e) => setNewAch({ ...newAch, label: e.target.value.toUpperCase() })}
                                />

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>SELECT ICON</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                        {ICONS.map(ic => (
                                            <button
                                                key={ic}
                                                onClick={() => setNewAch({ ...newAch, icon: ic })}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '50%',
                                                    border: newAch.icon === ic ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                                    background: newAch.icon === ic ? '#eff6ff' : 'white',
                                                    color: newAch.icon === ic ? '#3b82f6' : '#94a3b8',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Icon name={ic} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', display: 'block' }}>SELECT COLOR</label>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {COLORS.map(col => (
                                            <button
                                                key={col}
                                                onClick={() => setNewAch({ ...newAch, colorClass: col })}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    border: newAch.colorClass === col ? '2px solid #1e293b' : '2px solid transparent',
                                                    cursor: 'pointer',
                                                    background: col === 'gold' ? '#f59e0b' : col === 'purple' ? '#9333ea' : col === 'cyan' ? '#0ea5e9' : col === 'blue' ? '#2563eb' : col === 'orange' ? '#f97316' : '#22c55e'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        onClick={handleSaveAch}
                                        style={{ flex: 1, padding: '0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => handleEditToggle(null)}
                                        style={{ flex: 1, padding: '0.75rem', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="achievements-flex" style={{ flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                                    {profileData.achievements && profileData.achievements.length > 0 ? (
                                        profileData.achievements.map((ach) => (
                                            <div key={ach.id} className="achievement-unit" style={{ position: 'relative' }}>
                                                <div className={`achievement-circle ${ach.colorClass}`}>
                                                    <Icon name={ach.icon} />
                                                </div>
                                                <span className="achievement-text">{ach.label}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ width: '100%', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', padding: '1rem' }}>
                                            No achievements. Add one below!
                                        </div>
                                    )}
                                </div>
                                <button className="btn-add-dashed" onClick={() => handleEditToggle('achievements')} style={{ marginTop: '1rem' }}>
                                    <Icon name="add_circle" className="icon-xs" />
                                    ADD ACHIEVEMENT
                                </button>
                            </>
                        )}
                    </div>

                    {/* Headquarters */}
                    <div className="profile-card hq-card">
                        {editingSection === 'headquarters' ? (
                            // Edit Mode
                            <div className="animate-fade-in" style={{ padding: '1rem' }}>
                                <h4 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 700 }}>Edit Headquarters</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Address</label>
                                        <input
                                            type="text"
                                            className="profile-input"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                                            value={hqEdit.address}
                                            onChange={(e) => setHqEdit({ ...hqEdit, address: e.target.value })}
                                            placeholder="Street address"
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>City</label>
                                            <input
                                                type="text"
                                                className="profile-input"
                                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                                                value={hqEdit.city}
                                                onChange={(e) => setHqEdit({ ...hqEdit, city: e.target.value })}
                                                placeholder="City"
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>State</label>
                                            <input
                                                type="text"
                                                className="profile-input"
                                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                                                value={hqEdit.state}
                                                onChange={(e) => setHqEdit({ ...hqEdit, state: e.target.value })}
                                                placeholder="State"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                    <button
                                        className="btn-save-inline"
                                        onClick={handleSaveHQ}
                                        style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn-edit-profile"
                                        onClick={() => handleEditToggle(null)}
                                        style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <>
                                <div className="hq-map-area">
                                    <div className="map-icon-bg">
                                        <Icon name="map" className="map-icon-large" />
                                    </div>
                                </div>
                                <div className="hq-text-area">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4>Headquarters</h4>
                                        <button
                                            className="btn-edit-inline"
                                            onClick={() => handleEditToggle('headquarters')}
                                            style={{ padding: '0.35rem 0.75rem', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                        >
                                            <Icon name="edit" className="icon-sm" />
                                            Edit
                                        </button>
                                    </div>
                                    <p>{profileData.headquarters.address}<br />{profileData.headquarters.city}, {profileData.headquarters.state}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
