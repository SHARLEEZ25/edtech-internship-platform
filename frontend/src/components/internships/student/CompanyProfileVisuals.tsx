import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InternshipCard } from '@/components/internships/student/InternshipCard';
import AboutSection from '@/components/profile/recruiter/AboutSection';
import HiringStats from '@/components/profile/recruiter/HiringStats';
import EngagementsList from '@/components/profile/recruiter/EngagementsList';
import HiringRoles from '@/components/profile/recruiter/HiringRoles';
import Achievements from '@/components/profile/recruiter/Achievements';
import Headquarters from '@/components/profile/recruiter/Headquarters';
import { type Internship } from '@/api/internships.api';
import type { RecruiterProfileData } from '@/hooks/profile/recruiter/useRecruiterProfile';

interface CompanyProfileVisualsProps {
    profile: RecruiterProfileData;
    internships: Internship[];
    isFullProfile: boolean;
    onToggleProfileView: () => void;
}

export const CompanyProfileVisuals: React.FC<CompanyProfileVisualsProps> = ({
    profile,
    internships,
    isFullProfile,
}) => {
    const navigate = useNavigate();

    const hasStats = profile.stats.studentsHired > 0 || profile.stats.yearsOfExperience > 0 || profile.stats.activePostings > 0;
    const hasAchievements = profile.achievements.length > 0;
    const hasEngagements = profile.engagements.length > 0;
    const hasRoles = profile.hiringRoles && profile.hiringRoles.length > 0;
    const hasHQ = profile.headquarters.city || profile.headquarters.state;

    return (
        <div className="student-details-container">
            <header className="details-header-card">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back
                </button>

                <div className="header-main-content">
                    <div className="header-title-section w-full">
                        <div className="flex justify-between items-start w-full">
                            <div className="company-header" style={{ marginBottom: '0.5rem' }}>
                                <div className="company-logo-placeholder">
                                    {profile.companyName ? profile.companyName.charAt(0) : <span className="material-symbols-outlined">apartment</span>}
                                </div>
                                <div>
                                    <h1 className="details-title">{profile.companyName}</h1>
                                    <div className="details-company-row">
                                        <span className="material-symbols-outlined">location_on</span>
                                        <span className="text-gray-600 font-medium">{profile.location || 'Location not specified'}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            {!isFullProfile ? (
                <div className="animate-fade-in">
                    <section className="profile-card">
                        <h2 className="content-section-title">About the Company</h2>
                        <p className="content-text">
                            {profile.about}
                        </p>
                    </section>

                    <section style={{ marginTop: '2.5rem' }}>
                        <h2 className="content-section-title" style={{ marginBottom: '1.5rem' }}>
                            Open Positions ({internships.length})
                        </h2>

                        {internships.length === 0 ? (
                            <div className="empty-container">
                                <span className="material-symbols-outlined">work_off</span>
                                <p>No active internships at the moment.</p>
                            </div>
                        ) : (
                            <div className="internships-grid">
                                {internships.map(internship => (
                                    <InternshipCard key={internship.id} internship={internship} />
                                ))}
                            </div>
                        )}
                    </section>
                    <br />
                </div>
            ) : (
                <div className="animate-fade-in recruiter-profile-page company-profile-details">
                    <div className="profile-details-grid">
                        <div className="details-col-left">
                            <AboutSection
                                about={profile.about}
                                isEditing={false}
                            />
                            {hasStats && (
                                <HiringStats
                                    stats={profile.stats}
                                    isEditing={false}
                                />
                            )}
                            {hasEngagements && (
                                <EngagementsList
                                    engagements={profile.engagements}
                                    isEditing={false}
                                />
                            )}
                        </div>

                        <div className="details-col-right">
                            {hasRoles && (
                                <HiringRoles
                                    roles={profile.hiringRoles}
                                    isEditing={false}
                                />
                            )}
                            {hasAchievements && (
                                <Achievements
                                    achievements={profile.achievements}
                                    isEditing={false}
                                />
                            )}
                            {hasHQ && (
                                <Headquarters
                                    address={profile.headquarters.address}
                                    city={profile.headquarters.city}
                                    state={profile.headquarters.state}
                                    isEditing={false}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
