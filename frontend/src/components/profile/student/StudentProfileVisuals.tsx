import React from 'react';
import {
    ProfileHeader,
    ProfileBio,
    ProfileExperience,
    ProfileAchievements,
    ProfileEngagements,
    ProfileSkills
} from './index';

interface StudentProfileVisualsProps {
    profile: any;
    profileStrength: number;
    primaryRole: string;
    isEditingBio: boolean;
    isEditingRole: boolean;
    isAddingExp: boolean;
    isAddingAch: boolean;
    isAddingEngage: boolean;
    isManagingExp: boolean;
    isManagingAch: boolean;
    isManagingEngage: boolean;
    isEditingSkills: boolean;
    editingExpId: string | null;
    editingAchId: string | null;
    editingEngageId: string | null;
    bioText: string;
    experience: any[];
    achievements: any[];
    engagements: any[];
    localSkills: string[];
    newExp: any;
    newAch: any;
    newEngage: any;
    setBioText: (val: string) => void;
    setPrimaryRole: (val: string) => void;
    setNewExp: (val: any) => void;
    setNewAch: (val: any) => void;
    setNewEngage: (val: any) => void;
    handleSaveBio: () => void;
    handleSaveRole: () => void;
    handleSaveSkills: () => void;
    handleSaveBasic: (fields: any) => Promise<void>;
    handleAddExperience: () => void;
    handleDeleteExperience: (id: string) => void;
    startEditingExp: (exp: any) => void;
    handleAddAchievement: () => void;
    handleDeleteAchievement: (id: string) => void;
    startEditingAch: (ach: any) => void;
    handleAddEngagement: () => void;
    handleDeleteEngagement: (id: string) => void;
    startEditingEngage: (item: any) => void;
    toggleEditBio: () => void;
    toggleEditRole: () => void;
    toggleAddExp: () => void;
    toggleAddAch: () => void;
    toggleAddEngage: () => void;
    toggleManageExp: () => void;
    toggleManageAch: () => void;
    toggleManageEngage: () => void;
    toggleEditSkills: () => void;
    setLocalSkills: (skills: string[]) => void;
    isSavingBasic: boolean;
    errors: {
        role?: string | null;
        bio?: string | null;
        exp?: string | null;
        ach?: string | null;
        engage?: string | null;
    };
}

export const StudentProfileVisuals: React.FC<StudentProfileVisualsProps> = ({
    profile,
    profileStrength,
    primaryRole,
    isEditingBio,
    isEditingRole,
    isAddingExp,
    isAddingAch,
    isAddingEngage,
    isManagingExp,
    isManagingAch,
    isManagingEngage,
    isEditingSkills,
    editingExpId,
    editingAchId,
    editingEngageId,
    bioText,
    experience,
    achievements,
    engagements,
    localSkills,
    newExp,
    newAch,
    newEngage,
    setBioText,
    setPrimaryRole,
    setNewExp,
    setNewAch,
    setNewEngage,
    handleSaveBio,
    handleSaveRole,
    handleSaveSkills,
    handleSaveBasic,
    handleAddExperience,
    handleDeleteExperience,
    startEditingExp,
    handleAddAchievement,
    handleDeleteAchievement,
    startEditingAch,
    handleAddEngagement,
    handleDeleteEngagement,
    startEditingEngage,
    toggleEditBio,
    toggleEditRole,
    toggleAddExp,
    toggleAddAch,
    toggleAddEngage,
    toggleManageExp,
    toggleManageAch,
    toggleManageEngage,
    toggleEditSkills,
    setLocalSkills,
    isSavingBasic,
    errors
}) => {
    return (
        <div className="profile-page-container animate-fade-in">
            {/* Header Widget */}
            <ProfileHeader
                user={profile}
                strength={profileStrength}
                primaryRole={primaryRole}
                isEditingRole={isEditingRole}
                isSaving={isSavingBasic}
                onEditRole={toggleEditRole}
                onSaveRole={handleSaveRole}
                onRoleChange={setPrimaryRole}
                onSaveBasic={handleSaveBasic}
                error={errors.role}
            />

            <div className="profile-grid">
                {/* Left Column: Main Info */}
                <div className="profile-left-col">
                    <ProfileBio
                        bio={bioText}
                        isEditing={isEditingBio}
                        onEdit={toggleEditBio}
                        onSave={handleSaveBio}
                        onChange={setBioText}
                        error={errors.bio}
                    />
                    <ProfileExperience
                        items={experience}
                        isAdding={isAddingExp}
                        isManaging={isManagingExp}
                        editingId={editingExpId}
                        onToggleAdd={toggleAddExp}
                        onToggleManage={toggleManageExp}
                        newExp={newExp}
                        onNewExpChange={setNewExp}
                        onSave={handleAddExperience}
                        onDelete={handleDeleteExperience}
                        onStartEdit={startEditingExp}
                        error={errors.exp}
                    />
                    <ProfileEngagements
                        items={engagements}
                        isAdding={isAddingEngage}
                        isManaging={isManagingEngage}
                        editingId={editingEngageId}
                        onToggleAdd={toggleAddEngage}
                        onToggleManage={toggleManageEngage}
                        newEngage={newEngage}
                        onNewEngageChange={setNewEngage}
                        onSave={handleAddEngagement}
                        onDelete={handleDeleteEngagement}
                        onStartEdit={startEditingEngage}
                        error={errors.engage}
                    />
                </div>

                {/* Right Column: Sidebar Info */}
                <div className="profile-right-col">
                    {/* Target Role Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #5B8DEF 0%, #0066FF 100%)',
                        borderRadius: '24px',
                        padding: '2rem 1.75rem',
                        position: 'relative',
                        overflow: 'hidden',
                        marginBottom: '1.5rem'
                    }}>
                        {/* Decorative background icon */}
                        <div style={{
                            position: 'absolute',
                            right: '-8px',
                            bottom: '-90px',
                            opacity: 0.15,
                            fontSize: '145px',
                            color: 'white',
                            // transform: 'rotate(-15deg)'
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>code</span>
                        </div>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginBottom: '0.75rem'
                            }}>
                                Primary Target Role
                            </div>
                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: 700,
                                color: 'white',
                                margin: '0 0 1.25rem 0',
                                lineHeight: 1.2
                            }}>
                                {primaryRole || "Add your professional role"}
                            </h2>
                            {/* Skill tags */}
                            {primaryRole && localSkills.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {localSkills.slice(0, 2).map((skill, index) => (
                                        <span key={index} style={{
                                            background: 'rgba(255, 255, 255, 0.25)',
                                            color: 'white',
                                            padding: '0.375rem 0.875rem',
                                            borderRadius: '24px',
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Focus Areas / Skills */}
                    <ProfileSkills
                        skills={localSkills}
                        isEditing={isEditingSkills}
                        isSaving={isSavingBasic}
                        onToggleEdit={toggleEditSkills}
                        onSave={handleSaveSkills}
                        onSkillsChange={setLocalSkills}
                    />

                    {/* Achievements */}
                    <ProfileAchievements
                        items={achievements}
                        isAdding={isAddingAch}
                        isManaging={isManagingAch}
                        editingId={editingAchId}
                        onToggleAdd={toggleAddAch}
                        onToggleManage={toggleManageAch}
                        newAch={newAch}
                        onNewAchChange={setNewAch}
                        onSave={handleAddAchievement}
                        onDelete={handleDeleteAchievement}
                        onStartEdit={startEditingAch}
                        error={errors.ach}
                    />
                </div>
            </div>
        </div>
    );
};
