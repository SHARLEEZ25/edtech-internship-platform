import { useParams } from 'react-router-dom';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';
import { LoadingState } from '@/components/common/LoadingState';
import { InternshipDetailVisuals } from '@/components/internships/recruiter';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useRecruiterInternshipDetails } from '@/hooks/internships/recruiter/useRecruiterInternshipDetails';
import '@/styles/dashboard/recruiter-dashboard.css';

export default function InternshipDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const {
        internship,
        loading,
        error,
        stats,
        isDeleteModalOpen, 
        setIsDeleteModalOpen,
        handleDelete,
        navigateBack,
        navigateToApplications,
        navigateToEdit
    } = useRecruiterInternshipDetails(id);

    return (
        <div className="recruiter-dashboard-container">
            <RecruiterSidebar />
            <main className="recruiter-main">
                <div className="details-page-container">
                    <header className="details-page-header">
                        <h1 className="details-title">Internship Details</h1>
                        <p className="details-subtitle">View complete internship information and performance metrics.</p>
                    </header>

                    {loading ? (
                        <LoadingState />
                    ) : error || !internship ? (
                        <div className="error-state">
                            <h2>Error</h2>
                            <p>{error || 'Internship not found'}</p>
                            <button className="btn-recruiter btn-recruiter-primary" onClick={navigateBack}>
                                Back to Internships
                            </button>
                        </div>
                    ) : (
                        <InternshipDetailVisuals
                            internship={internship}
                            stats={stats}
                            companyName={internship.recruiter?.companyName || 'Company'}
                            onClose={() => setIsDeleteModalOpen(true)}
                            onViewApplicants={navigateToApplications}
                            onEdit={navigateToEdit}
                        />
                    )}

                    <ConfirmModal
                        isOpen={isDeleteModalOpen}
                        title="Delete Internship?"
                        message="Are you sure you want to delete this internship? This action cannot be undone."
                        onConfirm={handleDelete}
                        onCancel={() => setIsDeleteModalOpen(false)}
                        confirmLabel="Delete"
                    />
                </div>
            </main>
        </div>
    );
}
