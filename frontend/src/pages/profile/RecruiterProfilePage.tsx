import React from 'react';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';
import { useRecruiterProfile } from '@/hooks/profile/recruiter/useRecruiterProfile';
import { RecruiterProfileVisuals } from '@/components/profile/recruiter/RecruiterProfileVisuals';
import '@/styles/profile/recruiter-profile.css';

/**
 * Purpose: "The Full Company Dashboard Manager" Page
 * - Displays the comprehensive public-facing company profile.
 * - Uses useRecruiterProfile to manage rich features (Achievements, Stats, etc.)
 */
import { LoadingState } from '@/components/common/LoadingState';

const RecruiterProfilePage: React.FC = () => {
    const {
        profileData,
        isLoading,
        isRefreshing,
        editingSection,
        error,
        handleEditToggle,
        updateBasicProfile,
        addAchievement,
        deleteAchievement,
        addEngagement,
        deleteEngagement,
        updateEngagement
    } = useRecruiterProfile();

    if (isLoading) return <LoadingState fullPage />;

    if (error) return (
        <div className="profile-error-state animate-fade-in">
            <span className="material-symbols-outlined text-4xl">error</span>
            <p className="font-medium">{error}</p>
        </div>
    );

    return (
        <div className="recruiter-profile-page animate-fade-in">
            {/* Background Loading Bar for smooth updates */}
            {isRefreshing && (
                <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 z-[9999] animate-loading-bar"></div>
            )}

            <div className="profile-container">
                <RecruiterSidebar />

                <main className="profile-main-content">
                    <RecruiterProfileVisuals
                        profileData={profileData}
                        isRefreshing={isRefreshing}
                        editingSection={editingSection}
                        handleEditToggle={handleEditToggle}
                        updateBasicProfile={updateBasicProfile}
                        addAchievement={addAchievement}
                        deleteAchievement={deleteAchievement}
                        addEngagement={addEngagement}
                        deleteEngagement={deleteEngagement}
                        updateEngagement={updateEngagement}
                    />
                </main>
            </div>

            <style>{`
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(400%); }
                }
                .animate-loading-bar {
                    animation: loading-bar 2s infinite linear;
                }
            `}</style>
        </div>
    );
};

export default RecruiterProfilePage;
