import { useRecruiterInternships } from '@/hooks/internships/recruiter/useRecruiterInternships';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';
import {
    FirstTimeInternshipsView,
    InternshipHeaderVisuals,
    InternshipsListVisuals
} from '@/components/internships/recruiter';
import '@/styles/internships/recruiter/recruiter-internships.css';
import '@/styles/dashboard/recruiter-dashboard.css';

export default function RecruiterInternships() {
    const {
        loading,
        error,
        internships,
        formattedInternships,
        isFirstTime,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        clearFilters,
        handleCreate,
        handleEdit,
        handleView
    } = useRecruiterInternships();

    // Error state
    if (error) {
        return (
            <div className="recruiter-dashboard-container">
                <RecruiterSidebar />
                <main className="recruiter-main">
                    <div className="recruiter-internships-page">
                        <div className="error-state">
                            <h2>Unable to load internships</h2>
                            <p>{error}</p>
                            <button className="btn-recruiter btn-recruiter-primary" onClick={() => window.location.reload()}>Retry</button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // First-time user experience
    if (isFirstTime) {
        return (
            <div className="recruiter-dashboard-container">
                <RecruiterSidebar />
                <main className="recruiter-main">
                    <div className="recruiter-internships-page">
                        <FirstTimeInternshipsView onCreateClick={handleCreate} />
                    </div>
                </main>
            </div>
        );
    }

    // Returning user experience
    return (
        <div className="recruiter-dashboard-container">
            <RecruiterSidebar />
            <main className="recruiter-main-premium">
                <div className="recruiter-internships-page-premium">
                    <InternshipHeaderVisuals
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        onAddClick={handleCreate}
                    />

                    {internships.length === 0 && !loading ? (
                        <div className="no-results">
                            <p>No internships found matching your criteria.</p>
                            {(searchQuery || statusFilter !== 'ALL') && (
                                <button className="clear-filters-btn" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <InternshipsListVisuals
                            formattedInternships={formattedInternships}
                            onEdit={handleEdit}
                            onView={handleView}
                            onCreateNew={handleCreate}
                            loading={loading}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
