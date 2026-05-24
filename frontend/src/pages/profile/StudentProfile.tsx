import React from 'react';
import DashboardSidebar from '@/components/dashboard/student/DashboardSidebar';
import { useStudentProfile } from '@/hooks/profile/student/useStudentProfile';
import { StudentProfileVisuals } from '@/components/profile/student/StudentProfileVisuals';
import { LoadingState } from '@/components/common/LoadingState';
import '@/styles/profile/student-profile.css';

/**
 * Purpose: "The Student Profile Dashboard" Page
 * - The main page where students can view and manage their professional portfolio.
 * - Uses useStudentProfile to handle all data and edit logic.
 */
const StudentProfile: React.FC = () => {
    const {
        profile,
        isEditingBio,
        isEditingRole,
        isAddingExp,
        isAddingAch,
        isAddingEngage,
        isManagingExp,
        isManagingAch,
        isManagingEngage,
        editingExpId,
        editingAchId,
        editingEngageId,
        bioText,
        primaryRole,
        experience,
        achievements,
        engagements,
        newExp,
        newAch,
        newEngage,
        setBioText,
        setPrimaryRole,
        setNewExp,
        setNewAch,
        setNewEngage,
        profileStrength,
        handleSaveBio,
        handleSaveRole,
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
        loading,
        isSavingBasic,
        bioError, roleError, expError, achError, engageError,
        handleUpdateSkills,
        localSkills,
        setLocalSkills,
        isEditingSkills,
        toggleEditSkills,
        user
    } = useStudentProfile();

    if (loading) {
        return (
            <div className="student-dashboard animate-fade-in">
                <div className="dashboard-container">
                    <DashboardSidebar />
                    <div className="dashboard-main">
                        <main className="dashboard-content profile-loading-state">
                            <LoadingState />
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile || !user) {
        return (
            <div className="student-dashboard animate-fade-in">
                <div className="dashboard-container">
                    <DashboardSidebar />
                    <div className="dashboard-main">
                        <main className="dashboard-content profile-loading-state">
                            <div className="empty-state">
                                <h3>Profile not found</h3>
                                <p>Please log in to view your profile.</p>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="student-dashboard animate-fade-in">
            <div className="dashboard-container">
                <DashboardSidebar />

                <div className="dashboard-main">
                    <main className="dashboard-content">
                        <StudentProfileVisuals
                            profile={profile}
                            profileStrength={profileStrength}
                            primaryRole={primaryRole}
                            isEditingBio={isEditingBio}
                            isEditingRole={isEditingRole}
                            isAddingExp={isAddingExp}
                            isAddingAch={isAddingAch}
                            isAddingEngage={isAddingEngage}
                            isManagingExp={isManagingExp}
                            isManagingAch={isManagingAch}
                            isManagingEngage={isManagingEngage}
                            editingExpId={editingExpId}
                            editingAchId={editingAchId}
                            editingEngageId={editingEngageId}
                            bioText={bioText}
                            experience={experience}
                            achievements={achievements}
                            engagements={engagements}
                            newExp={newExp}
                            newAch={newAch}
                            newEngage={newEngage}
                            setBioText={setBioText}
                            setPrimaryRole={setPrimaryRole}
                            setNewExp={setNewExp}
                            setNewAch={setNewAch}
                            setNewEngage={setNewEngage}
                            handleSaveBio={handleSaveBio}
                            handleSaveRole={handleSaveRole}
                            handleSaveBasic={handleSaveBasic}
                            handleAddExperience={handleAddExperience}
                            handleDeleteExperience={handleDeleteExperience}
                            startEditingExp={startEditingExp}
                            handleAddAchievement={handleAddAchievement}
                            handleDeleteAchievement={handleDeleteAchievement}
                            startEditingAch={startEditingAch}
                            handleAddEngagement={handleAddEngagement}
                            handleDeleteEngagement={handleDeleteEngagement}
                            startEditingEngage={startEditingEngage}
                            toggleEditBio={toggleEditBio}
                            toggleEditRole={toggleEditRole}
                            toggleAddExp={toggleAddExp}
                            toggleAddAch={toggleAddAch}
                            toggleAddEngage={toggleAddEngage}
                            toggleManageExp={toggleManageExp}
                            toggleManageAch={toggleManageAch}
                            toggleManageEngage={toggleManageEngage}
                            toggleEditSkills={toggleEditSkills}
                            setLocalSkills={setLocalSkills}
                            handleSaveSkills={handleUpdateSkills}
                            localSkills={localSkills}
                            isEditingSkills={isEditingSkills}
                            isSavingBasic={isSavingBasic}
                            errors={{
                                role: roleError,
                                bio: bioError,
                                exp: expError,
                                ach: achError,
                                engage: engageError
                            }}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
