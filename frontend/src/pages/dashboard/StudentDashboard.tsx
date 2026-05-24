import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStudentDashboard } from '../../hooks/dashboard/useStudentDashboard';
import DashboardSidebar from '../../components/dashboard/student/DashboardSidebar';
import DashboardStats from '../../components/dashboard/student/DashboardStats';
import RecommendedInternships from '../../components/dashboard/student/RecommendedInternships';
import AICareerAssistant from '../../components/dashboard/student/AICareerAssistant';

import NotificationIcon from '../../components/dashboard/student/NotificationIcon';

import { LoadingState } from '../../components/common/LoadingState';

const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const {
        isLoading,
        appliedInternships,
        recommendedInternships,
        upcomingInterviews,
        profileStrength
    } = useStudentDashboard();

    // Get user's first name
    const getUserFirstName = () => {
        if (!user?.fullName) return 'Student';
        return user.fullName.split(' ')[0];
    };

    if (isLoading) {
        return <LoadingState fullPage />;
    }

    return (
        <div className="animate-fade-in">
            <div className="student-dashboard">
                <div className="dashboard-container">
                    <DashboardSidebar />

                    <div className="dashboard-main">
                        <main className="dashboard-content">
                            <div className="dashboard-grid">
                                {/* Main Content - Full Width */}
                                <div className="dashboard-col-full">
                                    {/* Welcome Header with Notification Icon */}
                                    <div className="dashboard-header-row">
                                        <div className="dashboard-header-text">
                                            <h1 className="dashboard-title">
                                                Welcome back, {getUserFirstName()}!
                                            </h1>
                                            <p className="dashboard-subtitle">
                                                Track your internship progress, learning journey, and AI-powered career insights.
                                            </p>
                                        </div>
                                        {/* Notification Icon (Visible on all screens) */}
                                        <div className="dashboard-notification-icon">
                                            <NotificationIcon />
                                        </div>
                                    </div>

                                    {/* Stats Cards */}
                                    <DashboardStats
                                        onboardingProgress={profileStrength}
                                        applications={appliedInternships}
                                        suggestedInternship={recommendedInternships.length > 0 ? recommendedInternships[0] : undefined}
                                        interviews={upcomingInterviews}
                                    />

                                    {/* Recommended Internships (Empty State for New User) */}
                                    <RecommendedInternships internships={recommendedInternships} />

                                    {/* AI Career Assistant */}
                                    <AICareerAssistant />
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
