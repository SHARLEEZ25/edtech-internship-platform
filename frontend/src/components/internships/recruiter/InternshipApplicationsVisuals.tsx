// Visual layout for viewing applications for a specific internship.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingState } from '@/components/common/LoadingState';
import { Avatar } from '@/components/common/Avatar';
import '@/styles/internships/recruiter/internship-applications.css';

interface InternshipApplicationsVisualsProps {
    applications: any[]; // Using any to allow mock override cleanly
    internshipTitle: string;
    loading: boolean;
    isGlobal?: boolean;
}

export const InternshipApplicationsVisuals: React.FC<InternshipApplicationsVisualsProps> = ({
    applications,
    internshipTitle,
    loading,
    isGlobal
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [interviewFilter, setInterviewFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Latest');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // 🎯 SAMPLE DATA FOR DEMO
    // Use props if available
    const rawApplications = (applications || []).map(app => ({
        id: app.id,
        student: {
            name: app.fullName,
            email: app.email,
            college: app.student?.collegeName || 'Unknown College',
            degree: app.student?.degree || 'Student',
            avatar: app.student?.user?.profilePicture // Removed default pravatar URL
        },
        appliedAt: new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        appliedAtDate: new Date(app.appliedAt), // For sorting
        statusRaw: app.status, // Keep raw status for filtering
        status: app.status.replace('_', ' ').toLowerCase().split(' ').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),

        interviewDate: null,
        internshipTitle: app.internship?.title || 'Unknown Internship'
    }));

    // Filter and Sort
    const filteredApplications = rawApplications.filter(app => {
        // Search
        const matchesSearch =
            app.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.student.email.toLowerCase().includes(searchQuery.toLowerCase());

        // Status Filter
        let matchesStatus = true;
        if (statusFilter !== 'All') {
            if (statusFilter === 'Shortlisted') matchesStatus = app.statusRaw === 'SHORTLISTED';
            else if (statusFilter === 'Interview') matchesStatus = app.statusRaw === 'INTERVIEW';
            else if (statusFilter === 'Selected') matchesStatus = app.statusRaw === 'SELECTED';
            else if (statusFilter === 'Rejected') matchesStatus = app.statusRaw === 'REJECTED';
            else if (statusFilter === 'Applied') matchesStatus = app.statusRaw === 'APPLIED';
            else if (statusFilter === 'Under Review') matchesStatus = app.statusRaw === 'UNDER_REVIEW';
        }

        // Interview Filter
        let matchesInterview = true;
        if (interviewFilter !== 'All') {
            if (interviewFilter === 'Scheduled') matchesInterview = app.statusRaw === 'INTERVIEW';
            else if (interviewFilter === 'Completed') matchesInterview = false; // Placeholder
            else if (interviewFilter === 'Not Scheduled') matchesInterview = app.statusRaw !== 'INTERVIEW';
        }

        return matchesSearch && matchesStatus && matchesInterview;
    }).sort((a, b) => {
        if (sortBy === 'Latest') return b.appliedAtDate.getTime() - a.appliedAtDate.getTime();
        if (sortBy === 'Oldest') return a.appliedAtDate.getTime() - b.appliedAtDate.getTime();
        if (sortBy === 'Name A-Z') return a.student.name.localeCompare(b.student.name);
        if (sortBy === 'Name Z-A') return b.student.name.localeCompare(a.student.name);
        return 0;
    });

    const toggleDropdown = (dropdown: string) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    if (loading) {
        return <LoadingState />;
    }

    const getStatusClass = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('shortlisted')) return 'status-badge shortlisted';
        if (s.includes('review')) return 'status-badge under-review';
        if (s.includes('applied')) return 'status-badge applied';
        if (s.includes('rejected')) return 'status-badge rejected';
        if (s.includes('selected')) return 'status-badge selected';
        return 'status-badge';
    };

    return (
        <div className="apps-page-container" onClick={() => setActiveDropdown(null)}> {/* Close dropdowns on outside click */}
            <header className="apps-page-header">
                <h1 className="apps-title">
                    {isGlobal ? "All Internship Applications" : `Applicants for ${internshipTitle}`}
                </h1>
                <p className="apps-subtitle">Review and manage candidates who applied for your internship postings.</p>
            </header>

            <div className="apps-controls-bar">
                <div className="apps-search-pill">
                    <span className="material-symbols-outlined search-icon-main">search</span>
                    <input
                        type="text"
                        className="apps-search-field"
                        placeholder="Search by student name or email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="apps-filters-pills" onClick={(e) => e.stopPropagation()}>
                    {/* Status Filter */}
                    <div className="filter-dropdown-wrapper" style={{ position: 'relative' }}>
                        <button
                            className={`control-pill ${statusFilter !== 'All' ? 'active' : ''}`}
                            onClick={() => toggleDropdown('status')}
                        >
                            Status: <span className="pill-bold">{statusFilter}</span>
                            <span className="material-symbols-outlined dropdown-mini">expand_more</span>
                        </button>
                        {activeDropdown === 'status' && (
                            <div className="dropdown-menu" style={{
                                position: 'absolute', top: '100%', left: 0, zIndex: 10,
                                background: 'white', borderRadius: '8px', padding: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                minWidth: '160px', marginTop: '4px', border: '1px solid #e2e8f0'
                            }}>
                                {['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map(option => (
                                    <div
                                        key={option}
                                        className="dropdown-item"
                                        style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', fontSize: '14px', color: '#1e293b' }}
                                        onClick={() => { setStatusFilter(option); setActiveDropdown(null); }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Interview Filter */}
                    <div className="filter-dropdown-wrapper" style={{ position: 'relative' }}>
                        <button
                            className={`control-pill ${interviewFilter !== 'All' ? 'active' : ''}`}
                            onClick={() => toggleDropdown('interview')}
                        >
                            Interview: <span className="pill-bold">{interviewFilter}</span>
                            <span className="material-symbols-outlined dropdown-mini">expand_more</span>
                        </button>
                        {activeDropdown === 'interview' && (
                            <div className="dropdown-menu" style={{
                                position: 'absolute', top: '100%', left: 0, zIndex: 10,
                                background: 'white', borderRadius: '8px', padding: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                minWidth: '160px', marginTop: '4px', border: '1px solid #e2e8f0'
                            }}>
                                {['All', 'Scheduled', 'Not Scheduled'].map(option => (
                                    <div
                                        key={option}
                                        className="dropdown-item"
                                        style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', fontSize: '14px', color: '#1e293b' }}
                                        onClick={() => { setInterviewFilter(option); setActiveDropdown(null); }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort Filter */}
                    <div className="filter-dropdown-wrapper" style={{ position: 'relative' }}>
                        <button
                            className={`control-pill sort-pill ${sortBy !== 'Latest' ? 'active' : ''}`}
                            onClick={() => toggleDropdown('sort')}
                        >
                            Sort by: <span className="pill-bold">{sortBy}</span>
                            <span className="material-symbols-outlined sort-mini">filter_list</span>
                        </button>
                        {activeDropdown === 'sort' && (
                            <div className="dropdown-menu" style={{
                                position: 'absolute', top: '100%', right: 0, zIndex: 10, // Align right for sort
                                background: 'white', borderRadius: '8px', padding: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                minWidth: '160px', marginTop: '4px', border: '1px solid #e2e8f0'
                            }}>
                                {['Latest', 'Oldest', 'Name A-Z', 'Name Z-A'].map(option => (
                                    <div
                                        key={option}
                                        className="dropdown-item"
                                        style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', fontSize: '14px', color: '#1e293b' }}
                                        onClick={() => { setSortBy(option); setActiveDropdown(null); }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="apps-table-white-container">
                <table className="apps-modern-table">
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>STUDENT</th>
                            <th style={{ width: '20%' }}>COLLEGE</th>
                            <th style={{ width: '15%' }}>APPLIED DATE</th>
                            <th style={{ width: '15%' }}>STATUS</th>
                            <th style={{ width: '20%' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.map((app) => (
                            <tr key={app.id}>
                                <td>
                                    <div className="student-profile-cell">
                                        <Avatar
                                            src={app.student.avatar}
                                            name={app.student.name}
                                            size="md"
                                            className="student-avatar-img" // Keep class for spacing if needed, or remove if Avatar handles it
                                        />
                                        <div className="student-info-col">
                                            <div className="student-name-row">
                                                <span className="student-name-text">{app.student.name}</span>
                                            </div>
                                            <span className="student-email-text">{app.student.email}</span>
                                            {isGlobal && <span className="applied-for-role">Applied for: {app.internshipTitle}</span>}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="college-info-col">
                                        <span className="college-name-text">{app.student.college}</span>
                                        <span className="college-degree-text">{app.student.degree}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="applied-date-col">
                                        <span className="date-main-text">{app.appliedAt.split(',')[0]}</span>
                                        <span className="date-sub-text">{app.appliedAt.split(',')[1]}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="status-col-modern">
                                        <span className={getStatusClass(app.status)}>
                                            {app.status}
                                        </span>
                                        {app.interviewDate && (
                                            <div className="interview-note">
                                                <span className="dot-blue">•</span> Interview {app.interviewDate}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className="actions-row-modern">
                                        <button className="btn-icon-grey" title="View Resume">
                                            <span className="material-symbols-outlined">description</span>
                                        </button>
                                        <Link to={`/dashboard/recruiter/applications/${app.id}`} className="btn-view-details-premium">
                                            View Details
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="apps-table-footer-modern">
                    <span className="pagination-info">Showing 1-{filteredApplications.length} of {filteredApplications.length} applicants</span>
                    <div className="pagination-actions">
                        <button className="pagination-circle-btn">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="pagination-circle-btn">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
