import { StudentDashboardLayout } from '@/components/layout/StudentDashboardLayout';
import { MyApplicationsVisuals } from '@/components/internships/student/MyApplicationsVisuals';
import { useMyApplications } from '@/hooks/internships/student/useMyApplications';

export default function MyApplicationsPage() {
    const {
        applications,
        allApplications,
        loading,
        handleApplicationAction,
        recruiters,
        locations,
        filters,
        setFilters
    } = useMyApplications();

    return (
        <StudentDashboardLayout>
            <MyApplicationsVisuals
                applications={applications}
                allApplications={allApplications}
                loading={loading}
                onApplicationAction={handleApplicationAction}
                recruiters={recruiters}
                locations={locations}
                filters={filters}
                onFilterChange={setFilters}
            />
        </StudentDashboardLayout>
    );
}
