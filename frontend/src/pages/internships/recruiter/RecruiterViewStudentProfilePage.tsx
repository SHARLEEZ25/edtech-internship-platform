import { useParams, useNavigate } from "react-router-dom";
import { useRecruiterViewStudentProfile } from "@/hooks/profile/recruiter/useRecruiterViewStudentProfile";
import {
    ProfileHeader,
    ProfileBio,
    ProfileExperience,
    ProfileAchievements,
    ProfileEngagements,
    ProfileSkills
} from "@/components/profile/student";
import "@/styles/profile/student-profile.css";

/**
 * Purpose: "The Student Inspector" Page
 * - Allows a recruiter to view a candidate's profile (Read-Only).
 * - Uses useRecruiterViewStudentProfile to fetch student data via ID.
 */
const RecruiterViewStudentProfilePage = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();

    const {
        profile,
        skills,
        achievements,
        loading,
        error
    } = useRecruiterViewStudentProfile(studentId);

    if (loading) {
        return (
            <div className="dashboard-main" style={{ minHeight: '100vh', background: '#f8fafc' }}>
                <div className="profile-loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="dashboard-main" style={{ minHeight: '100vh', padding: '2rem' }}>
                <button className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: '1rem', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#64748b' }}>
                    <span className="material-symbols-outlined">arrow_back</span> Back
                </button>
                <div className="error-message" style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <h3>{error || "Profile not found"}</h3>
                </div>
            </div>
        );
    }

    const noop = () => { };

    return (
        <div className="student-dashboard">
            <div className="dashboard-container">
                <div className="dashboard-main" style={{ marginLeft: 0, width: '100%' }}>
                    <main className="dashboard-content">
                        <div className="profile-page-container">
                            <button className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: '1rem', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#64748b', fontWeight: 500 }}>
                                <span className="material-symbols-outlined">arrow_back</span> Back to Application
                            </button>

                            {/* Header Widget */}
                            <ProfileHeader
                                user={profile}
                                strength={profile.profileStrength || 0}
                                primaryRole={profile.headline || ""}
                                isEditingRole={false}
                                onEditRole={noop}
                                onSaveRole={noop}
                                onRoleChange={noop}
                                onSaveBasic={() => Promise.resolve()}
                                readOnly={true}
                            />

                            <div className="profile-grid">
                                {/* Left Column: Main Info */}
                                <div className="profile-left-col" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <ProfileBio
                                        bio={profile.about || "No bio added."}
                                        isEditing={false}
                                        onEdit={noop}
                                        onSave={noop}
                                        onChange={noop}
                                        readOnly={true}
                                    />
                                    <ProfileExperience
                                        items={profile.experiences || []}
                                        isAdding={false}
                                        isManaging={false}
                                        editingId={null}
                                        onToggleAdd={noop}
                                        onToggleManage={noop}
                                        newExp={{}}
                                        onNewExpChange={noop}
                                        onSave={noop}
                                        onDelete={noop}
                                        onStartEdit={noop}
                                        readOnly={true}
                                    />
                                </div>

                                {/* Right Column: Sidebar Info */}
                                <div className="profile-right-col" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div className="profile-card target-role-card">
                                        <div className="target-role-content">
                                            <h3>Primary Target Role</h3>
                                            <div className="target-role-name">{profile.headline || "No role specified"}</div>
                                        </div>
                                    </div>

                                    <ProfileSkills
                                        skills={skills}
                                        isEditing={false}
                                        isSaving={false}
                                        onToggleEdit={noop}
                                        onSave={noop}
                                        onSkillsChange={noop}
                                        readOnly={true}
                                    />

                                    <ProfileAchievements
                                        items={achievements}
                                        isAdding={false}
                                        isManaging={false}
                                        editingId={null}
                                        onToggleAdd={noop}
                                        onToggleManage={noop}
                                        newAch={{}}
                                        onNewAchChange={noop}
                                        onSave={noop}
                                        onDelete={noop}
                                        onStartEdit={noop}
                                        readOnly={true}
                                    />
                                </div>

                                {/* Bottom Full Width: Engagements */}
                                <ProfileEngagements
                                    items={profile.engagements || []}
                                    isAdding={false}
                                    isManaging={false}
                                    editingId={null}
                                    onToggleAdd={noop}
                                    onToggleManage={noop}
                                    newEngage={{}}
                                    onNewEngageChange={noop}
                                    onSave={noop}
                                    onDelete={noop}
                                    onStartEdit={noop}
                                    readOnly={true}
                                />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default RecruiterViewStudentProfilePage;
