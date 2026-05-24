import { useNavigate } from 'react-router-dom';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';
import { InternshipApplicationsVisuals } from '@/components/internships/recruiter';
import { useRecruiterApplications } from '@/hooks/internships/recruiter/useRecruiterApplications';
import '@/styles/dashboard/recruiter-dashboard.css';

export default function AllRecruiterApplicationsPage() {
    const navigate = useNavigate();
    const { applications, loading, error } = useRecruiterApplications();

    return (
        <div className="recruiter-dashboard-container">
            <RecruiterSidebar />
            <main className="recruiter-main">
                {error ? (
                    <div className="error-state">
                        <h2>Error</h2>
                        <p>{error}</p>
                        <button className="btn-recruiter btn-recruiter-primary" onClick={() => navigate(-1)}>
                            Go Back
                        </button>
                    </div>
                ) : (
                    <InternshipApplicationsVisuals
                        applications={applications}
                        internshipTitle="All Posts"
                        loading={loading}
                        isGlobal={true}
                    />
                )}
            </main>
        </div>
    );
}
