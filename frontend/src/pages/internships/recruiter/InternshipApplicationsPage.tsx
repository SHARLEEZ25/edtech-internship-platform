import { useParams, useNavigate } from 'react-router-dom';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';
import { InternshipApplicationsVisuals } from '@/components/internships/recruiter';
import { useRecruiterApplications } from '@/hooks/internships/recruiter/useRecruiterApplications';
import '@/styles/dashboard/recruiter-dashboard.css';

export default function InternshipApplicationsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { applications, internshipTitle, loading, error } = useRecruiterApplications(id);

    return (
        <div className="recruiter-dashboard-container">
            <RecruiterSidebar />
            <main className="recruiter-main">
                {error ? (
                    <div className="error-state" style={{ padding: '2rem' }}>
                        <h2>Error</h2>
                        <p>{error}</p>
                        <button className="btn-recruiter btn-recruiter-primary" onClick={() => navigate(-1)}>
                            Go Back
                        </button>
                    </div>
                ) : (
                    <InternshipApplicationsVisuals
                        applications={applications}
                        internshipTitle={internshipTitle}
                        loading={loading}
                    />
                )}
            </main>
        </div>
    );
}
