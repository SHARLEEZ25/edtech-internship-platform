import { useParams, useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/student/DashboardSidebar';
import { CompanyProfileVisuals } from '@/components/internships/student/CompanyProfileVisuals';
import { useCompanyProfile } from '@/hooks/internships/student/useCompanyProfile';
import { LoadingState } from '@/components/common/LoadingState';
import '@/styles/internships/student/internship-details.css';
import '@/styles/dashboard/student-dashboard.css';
import '@/styles/profile/recruiter-profile.css';
import '@/styles/profile/student/company-profile.css';

export default function CompanyProfilePage() {
    const { recruiterId } = useParams<{ recruiterId: string }>();
    const navigate = useNavigate();

    const {
        profile,
        internships,
        loading,
        error,
        isFullProfile,
        toggleProfileView
    } = useCompanyProfile(recruiterId);

    if (loading) {
        return (
            <div className="light animate-fade-in">
                <div className="student-dashboard">
                    <div className="dashboard-container">
                        <DashboardSidebar />
                        <main className="dashboard-main">
                            <LoadingState />
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="light animate-fade-in">
                <div className="student-dashboard">
                    <div className="dashboard-container">
                        <DashboardSidebar />
                        <main className="dashboard-main">
                            <div className="student-details-container">
                                <h2>Error</h2>
                                <p>{error || 'Company not found'}</p>
                                <button onClick={() => navigate(-1)}>Go Back</button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="light animate-fade-in">
            <div className="student-dashboard">
                <div className="dashboard-container">
                    <DashboardSidebar />
                    <main className="dashboard-main">
                        <CompanyProfileVisuals
                            profile={profile}
                            internships={internships}
                            isFullProfile={isFullProfile}
                            onToggleProfileView={toggleProfileView}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
}
