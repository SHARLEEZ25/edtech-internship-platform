import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRecruiterDashboardData } from '../../hooks/dashboard/useRecruiterDashboardData';
import RecruiterSidebar from '../../components/dashboard/recruiter/RecruiterSidebar';
import RecruiterStats from '../../components/dashboard/recruiter/RecruiterStats';
import ActiveInternships from '../../components/dashboard/recruiter/ActiveInternships';
import RecentApplications from '../../components/dashboard/recruiter/RecentApplications';
import QuickActions from '../../components/dashboard/recruiter/QuickActions';
import UpcomingInterviews from '../../components/dashboard/recruiter/UpcomingInterviews';
import { LoadingState } from '../../components/common/LoadingState';
import '../../styles/dashboard/recruiter-dashboard.css';

const RecruiterDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const {
        statItems,
        activeInternships,
        recentApplications,
        upcomingInterviews,
        isLoading,
        error
    } = useRecruiterDashboardData();

    useEffect(() => {
        document.title = 'Thozhil - Company Dashboard';
    }, []);

    if (isLoading) {
        return <LoadingState fullPage={true} />;
    }

    if (error) {
        return <div className="error-screen">{error}</div>;
    }

    return (
        <div className="recruiter-dashboard-container animate-fade-in">
            <RecruiterSidebar />

            <main className="recruiter-main">
                <div className="dashboard-wrapper">
                    {/* Header */}
                    <header className="recruiter-header">
                        <div>
                            <h2 className="header-title">Welcome back, {user?.fullName || 'Company'} 👋</h2>
                            <p className="header-subtitle">Here’s a quick overview of your internship activity.</p>
                        </div>
                        <div className="header-actions">
                            <button
                                className="btn-recruiter btn-recruiter-primary"
                                onClick={() => navigate('/dashboard/recruiter/internships/new')}
                            >
                                <span className="material-symbols-outlined">add</span>
                                Post Internship
                            </button>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <RecruiterStats statItems={statItems} />

                    {/* Main Grid: 2/3 and 1/3 columns */}
                    <div className="dashboard-grid-recruiter">
                        <div className="col-span-2 space-y-6">
                            <ActiveInternships internships={activeInternships} />
                            <RecentApplications applications={recentApplications} />
                        </div>

                        <div className="space-y-6">
                            <QuickActions />
                            <UpcomingInterviews interviews={upcomingInterviews} />
                        </div>
                    </div>


                </div>
            </main>
        </div>
    );
};

export default RecruiterDashboard;

