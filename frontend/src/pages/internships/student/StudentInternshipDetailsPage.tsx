import { useParams } from 'react-router-dom';
import { StudentDashboardLayout } from '@/components/layout/StudentDashboardLayout';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { StudentInternshipDetailsVisuals } from '@/components/internships/student/StudentInternshipDetailsVisuals';
import { useStudentInternshipDetails } from '@/hooks/internships/student/useStudentInternshipDetails';
import '@/styles/internships/student/internship-details.css';

export default function StudentInternshipDetailsPage() {
    const { id } = useParams<{ id: string }>();

    const {
        internship,
        loading,
        error,
        applicationId,
        isWithdrawModalOpen,
        isActionLoading,
        setIsWithdrawModalOpen,
        handleSaveToggle,
        handleWithdrawConfirm,
        formatStipend,
        formatDuration
    } = useStudentInternshipDetails(id);

    if (loading) {
        return (
            <StudentDashboardLayout>
                <div className="student-details-container">
                    <LoadingState />
                </div>
            </StudentDashboardLayout>
        );
    }

    if (error || !internship) {
        return (
            <StudentDashboardLayout>
                <div className="student-details-container">
                    <ErrorState error={error || 'Internship not found'} />
                </div>
            </StudentDashboardLayout>
        );
    }

    return (
        <StudentDashboardLayout>
            <StudentInternshipDetailsVisuals
                internship={internship}
                applicationId={applicationId}
                isWithdrawModalOpen={isWithdrawModalOpen}
                isActionLoading={isActionLoading}
                onWithdrawCancel={() => setIsWithdrawModalOpen(false)}
                onWithdrawConfirm={handleWithdrawConfirm}
                onWithdrawClick={() => setIsWithdrawModalOpen(true)}
                onSaveToggle={handleSaveToggle}
                formattedStipend={formatStipend()}
                formattedDuration={formatDuration()}
            />
        </StudentDashboardLayout>
    );
}
