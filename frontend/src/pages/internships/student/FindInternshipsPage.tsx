import { StudentDashboardLayout } from '@/components/layout/StudentDashboardLayout';
import { FindInternshipsVisuals } from '@/components/internships/student/FindInternshipsVisuals';
import { useStudentInternships } from '@/hooks/internships/student/useStudentInternships';
import '@/styles/internships/student/find-internships.css';

export default function FindInternshipsPage() {
    const {
        internships,
        loading,
        isInitialLoading,
        error,
        total,
        page,
        totalPages,
        filters,
        updateFilters,
        setPage,
        clearFilters
    } = useStudentInternships({ limit: 12 });

    return (
        <StudentDashboardLayout>
            <FindInternshipsVisuals
                internships={internships}
                loading={loading}
                isInitialLoading={isInitialLoading}
                error={error}
                filters={filters}
                pagination={{
                    total: total,
                    page: page,
                    totalPages: totalPages
                }}
                onFilterChange={updateFilters}
                onPageChange={setPage}
                onSearch={(q) => updateFilters({ search: q })}
                onClearFilters={clearFilters}
            />
        </StudentDashboardLayout>
    );
}
