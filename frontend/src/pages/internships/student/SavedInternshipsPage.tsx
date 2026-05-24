import { StudentDashboardLayout } from '@/components/layout/StudentDashboardLayout';
import { SavedInternshipsVisuals } from '@/components/internships/student/SavedInternshipsVisuals';
import { useSavedInternships } from '@/hooks/internships/student/useSavedInternships';

export default function SavedInternshipsPage() {
    const {
        internships,
        loading,
        error,
        actionLoading,
        handleUnsave,
        handleNavigateToDetails,
        handleNavigateToBrowse
    } = useSavedInternships();

    return (
        <StudentDashboardLayout>
            <SavedInternshipsVisuals
                internships={internships}
                loading={loading}
                error={error}
                actionLoading={actionLoading}
                onUnsave={handleUnsave}
                onViewDetails={handleNavigateToDetails}
                onBrowse={handleNavigateToBrowse}
            />
        </StudentDashboardLayout>
    );
}
