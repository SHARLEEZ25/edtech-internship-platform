import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '@/components/dashboard/student/DashboardSidebar';
import '@/styles/dashboard/student-dashboard.css';
import '@/styles/internships/student/student-past-interviews.css';

import { internshipsApi, type Application } from '@/api/internships.api';
import { getStudentApplicationStatusText } from '@/utils/internshipFormatters';

interface HistoryItem {
    id: string;
    role: string;
    company: string;
    date: string;
    status: string;
}

export default function StudentPastInterviewsPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await internshipsApi.getMyApplications();
                const apps: Application[] = res.data.data || res.data || [];

                const mappedHistory: HistoryItem[] = apps.map(app => ({
                    id: app.id,
                    role: app.internship?.title || 'Unknown Role',
                    company: app.internship?.recruiter?.companyName || 'Unknown Company',
                    date: new Date(app.updatedAt || app.appliedAt).toLocaleDateString(),
                    status: getStudentApplicationStatusText(app.status)
                }));

                setHistoryData(mappedHistory);
            } catch (err) {
                console.error('Failed to load history', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Selected': return 'hist-badge selected';
            case 'Rejected': return 'hist-badge rejected';
            case 'Applied': return 'hist-badge pending';
            case 'Shortlisted': return 'hist-badge awaiting';
            case 'Under Interview': return 'hist-badge awaiting';
            case 'Awaiting Evaluation': return 'hist-badge awaiting';
            case 'No Show': return 'hist-badge noshow';
            default: return 'hist-badge';
        }
    };

    const filteredData = historyData.filter(item =>
        item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="student-dashboard">
                <div className="dashboard-container">
                    <StudentSidebar />
                    <main className="dashboard-main">
                        <div className="dashboard-content flex items-center justify-center">
                            Loading history...
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="student-dashboard">
            <div className="dashboard-container">
                <StudentSidebar />

                <main className="dashboard-main">
                    <div className="dashboard-content">
                        <div className="past-interviews-container">

                            <h1 className="hist-page-title">Past Interviews History</h1>

                            {/* Filters Bar */}
                            <div className="hist-filters-bar">
                                <div className="hist-search-wrapper">
                                    <span className="material-symbols-outlined hist-search-icon">search</span>
                                    <input
                                        type="text"
                                        className="hist-search-input"
                                        placeholder="Search by Company or Role"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="hist-filters-right">
                                    <button className="hist-filter-btn">
                                        Sort by: <span>Date</span> <span className="material-symbols-outlined icon-xs">expand_more</span>
                                    </button>
                                    <button className="hist-filter-btn">
                                        Status <span className="material-symbols-outlined icon-xs">expand_more</span>
                                    </button>
                                    <button className="hist-filter-btn">
                                        Company <span className="material-symbols-outlined icon-xs">expand_more</span>
                                    </button>
                                </div>
                            </div>

                            {/* List */}
                            <div className="hist-list">
                                {filteredData.length > 0 ? (
                                    filteredData.map(item => (
                                        <div key={item.id} className="hist-card">
                                            <div className="hist-info-col">
                                                <h3 className="hist-role">{item.role}</h3>
                                                <p className="hist-company">{item.company}</p>
                                                <div className="hist-date-row">
                                                    <span className="material-symbols-outlined icon-xs">calendar_month</span>
                                                    {item.date}
                                                </div>
                                            </div>

                                            <div className="hist-actions-col">
                                                <span className={getStatusClass(item.status)}>
                                                    {item.status}
                                                </span>
                                                <button className="hist-btn-details" onClick={() => navigate(`/dashboard/student/interviews/${item.id}`)}>
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500">No interviews found found matching criteria.</div>
                                )}
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
