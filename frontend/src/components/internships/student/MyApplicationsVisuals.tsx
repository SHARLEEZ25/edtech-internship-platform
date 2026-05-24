// Visual layout for the student's 'My Applications' page.
import React from 'react';
import { type Application } from '@/api/internships.api';
import { ApplicationCard } from './ApplicationCard';
import { Link } from 'react-router-dom';
import '@/styles/internships/student/my-applications.css';

interface MyApplicationsVisualsProps {
    applications: Application[]; // This is now the already filtered list
    allApplications: Application[]; // Support stats
    loading: boolean;
    onApplicationAction: (app: Application) => void;
    recruiters: (string | undefined)[];
    locations: (string | undefined)[];
    filters: {
        status: string;
        recruiter: string;
        location: string;
        dateSort: string;
    };
    onFilterChange: {
        setStatus: (status: string) => void;
        setRecruiter: (recruiter: string) => void;
        setLocation: (location: string) => void;
        setDateSort: (sort: string) => void;
    };
}

export const MyApplicationsVisuals: React.FC<MyApplicationsVisualsProps> = ({
    applications,
    allApplications: _allApplications,
    loading,
    onApplicationAction,
    recruiters,
    locations,
    filters,
    onFilterChange
}) => {

    if (loading) {
        return (
            /* [VISUAL STATE]: Loading State. Skeletons for application cards. */
            <div className="my-applications-container animate-fade-in">
                <div className="page-header">
                    <h1 className="page-title">My Applications</h1>
                </div>
                <div className="stats-row" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="skeleton-stat" style={{ flex: 1, height: '100px', backgroundColor: '#fff', borderRadius: '24px' }}></div>
                    ))}
                </div>
                <div className="applications-grid">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="application-card skeleton-card"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="my-applications-container animate-fade-in">
            <header className="page-header">
                <div>
                    <h1 className="page-title">My Applications</h1>
                    <p style={{ color: '#64748b', marginTop: '0.5rem', fontWeight: '500' }}>
                        Track and manage your internship journey
                    </p>
                </div>
                {/* [VISUAL STATE]: Primary Action. Button to browse new internships. */}
                <Link to="/dashboard/student/internships" className="btn-new-application">
                    <span className="material-symbols-outlined">explore</span>
                    Browse New
                </Link>
            </header>


            {/* [VISUAL STATE]: Filters Bar. Controls for filtering applications. */}
            <div className="filters-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: '1.25rem' }}>filter_list</span>
                    <span style={{ fontWeight: '700', color: '#334155', fontSize: '0.9375rem', marginRight: '0.5rem' }}>Filters</span>
                </div>

                <select
                    className="filter-select"
                    value={filters.status}
                    onChange={(e) => onFilterChange.setStatus(e.target.value)}
                >
                    <option value="ALL">All Status</option>
                    <option value="APPLIED">Applied</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="SELECTED">Selected</option>
                    <option value="REJECTED">Rejected</option>
                </select>

                <select
                    className="filter-select"
                    value={filters.recruiter}
                    onChange={(e) => onFilterChange.setRecruiter(e.target.value)}
                >
                    <option value="ALL">All Companies</option>
                    {recruiters.map(r => (
                        <option key={String(r)} value={String(r)}>{r}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={filters.location}
                    onChange={(e) => onFilterChange.setLocation(e.target.value)}
                >
                    <option value="ALL">All Locations</option>
                    {locations.map(l => (
                        <option key={String(l)} value={String(l)}>{l}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={filters.dateSort}
                    onChange={(e) => onFilterChange.setDateSort(e.target.value)}
                    style={{ marginLeft: 'auto' }}
                >
                    <option value="DESC">Newest First</option>
                    <option value="ASC">Oldest First</option>
                </select>
            </div>

            {applications.length > 0 ? (
                /* [VISUAL STATE]: List View. Grid of application cards. */
                <div className="applications-grid">
                    {applications.map(app => (
                        <ApplicationCard
                            key={app.id}
                            application={app}
                            onAction={onApplicationAction}
                        />
                    ))}
                </div>
            ) : (
                /* [VISUAL STATE]: Empty State. Shown when no applications match or exist. */
                <div className="empty-state "
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // height: '100%',
                    padding: '2rem',
                    textAlign: 'center',
                }}>
                    <span className="material-symbols-outlined empty-icon">rocket_launch</span>
                    <p className="empty-text">
                        {filters.status !== 'ALL' || filters.recruiter !== 'ALL' || filters.location !== 'ALL'
                            ? "No applications match your current filters. Try refining your search!"
                            : "Your journey starts here. Apply to your first internship and track it right here!"}
                    </p>
                    <Link to="/dashboard/student/internships" className="btn-new-application btn-centered">
                        Explore Opportunities
                    </Link>
                </div>
            )}
        </div>
    );
};


