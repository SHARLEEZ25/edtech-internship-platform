import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '@/components/dashboard/student/DashboardSidebar';
import { useMyApplications } from '@/hooks/internships/student/useMyApplications';
import { internshipsApi } from '@/api/internships.api';
import toast from 'react-hot-toast';
import '@/styles/dashboard/student-dashboard.css';
import '@/styles/internships/student/student-offer-letter.css';

export default function StudentOfferLetterPage() {
    const navigate = useNavigate();
    const { applications, loading, refetch } = useMyApplications();
    const [responding, setResponding] = useState(false);

    // Filter applications that have an offer (SELECTED, OFFER_SENT, OFFER_ACCEPTED, HIRED, OFFER_DECLINED)
    const offers = useMemo(() => {
        return applications.filter(app => ['SELECTED', 'OFFER_SENT', 'OFFER_ACCEPTED', 'HIRED', 'OFFER_DECLINED'].includes(app.status));
    }, [applications]);

    const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

    // Auto-select first offer if none selected
    useEffect(() => {
        if (offers.length > 0 && !selectedOfferId) {
            setSelectedOfferId(offers[0].id);
        }
    }, [offers, selectedOfferId]);

    const selectedOffer = useMemo(() =>
        offers.find(o => o.id === selectedOfferId) || null,
        [offers, selectedOfferId]);

    const handleOfferResponse = async (status: 'OFFER_ACCEPTED' | 'OFFER_DECLINED') => {
        if (!selectedOffer) return;
        setResponding(true);
        try {
            await internshipsApi.updateApplicationStatus(selectedOffer.id, {
                status,
                remarks: status === 'OFFER_ACCEPTED' ? 'Student accepted the offer.' : 'Student declined the offer.'
            });
            toast.success(status === 'OFFER_ACCEPTED' ? 'Congratulations! Offer accepted.' : 'Offer declined.');
            await refetch();
        } catch (err: any) {
            toast.error('Failed to respond to offer');
        } finally {
            setResponding(false);
        }
    };

    return (
        <div className="student-dashboard">
            <div className="dashboard-container">
                <StudentSidebar />

                <main className="dashboard-main">
                    <div className="dashboard-content" style={{ padding: '2rem' }}>

                        <div className="offer-page-layout">
                            {loading ? (
                                <div className="flex items-center justify-center w-full h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : offers.length === 0 ? (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    gap: '1rem',
                                    padding: '2rem',
                                    width: '100%'
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#cbd5e1' }}>description</span>
                                    <h2 style={{ color: '#64748b', fontSize: '1.25rem', fontWeight: '600', margin: '0' }}>No Offer Letters Yet</h2>
                                    <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0' }}>
                                        Your offer letters will appear here once a recruiter selects you for an internship.
                                    </p>
                                    <button
                                        onClick={() => navigate('/dashboard/student/applications')}
                                        className="btn-primary"
                                        style={{ marginTop: '0.5rem', width: 'auto', padding: '10px 24px', height: 'auto' }}
                                    >
                                        View Applications
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Left Sidebar - Offer List */}
                                    <div className="offer-sidebar">
                                        <h2 className="offer-list-header">My Offers ({offers.length})</h2>
                                        {offers.map(offer => (
                                            <div
                                                key={offer.id}
                                                onClick={() => setSelectedOfferId(offer.id)}
                                                className={`offer-list-item ${selectedOfferId === offer.id ? 'active' : ''}`}
                                            >
                                                <div className="offer-list-icon">
                                                    <span className="material-symbols-outlined">corporate_fare</span>
                                                </div>
                                                <div className="offer-list-content">
                                                    <div className="offer-list-company">{offer.internship?.recruiter?.companyName}</div>
                                                    <div className="offer-list-role">{offer.internship?.title}</div>
                                                </div>
                                                {selectedOfferId === offer.id && (
                                                    <span className="material-symbols-outlined offer-active-indicator" style={{ fontSize: '1rem' }}>arrow_forward_ios</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Content - Offer Preview */}
                                    <div className="offer-preview-pane">
                                        {selectedOffer && (
                                            <div className="offer-letter-modern-container">

                                                {/* Header Section */}
                                                <div className="modern-offer-header">
                                                    <h1 className="modern-offer-title">
                                                        Offer Letter
                                                        {['OFFER_ACCEPTED', 'HIRED'].includes(selectedOffer.status) && (
                                                            <span className="material-symbols-outlined check-icon text-green-500">verified</span>
                                                        )}
                                                    </h1>
                                                    <p className="modern-offer-subtitle">
                                                        {['OFFER_ACCEPTED', 'HIRED'].includes(selectedOffer.status)
                                                            ? 'Congratulations! You have officially joined the team.'
                                                            : 'Congratulations! You have been selected for the internship.'}
                                                    </p>
                                                </div>

                                                {/* Main Display Card */}
                                                <div className="modern-offer-card">

                                                    <div className="modern-card-header">
                                                        <div className="company-branding">
                                                            <div className="company-logo-box">
                                                                <span className="material-symbols-outlined">corporate_fare</span>
                                                            </div>
                                                            <div className="company-text">
                                                                <h2 className="company-name-text">{selectedOffer.internship?.recruiter?.companyName}</h2>
                                                                <p className="role-name-text">{selectedOffer.internship?.title}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="modern-details-grid">
                                                        <div className="modern-detail-item">
                                                            <span className="modern-label">Internship Type</span>
                                                            <span className="modern-value">{selectedOffer.internship?.internshipType}</span>
                                                        </div>
                                                        <div className="modern-detail-item">
                                                            <span className="modern-label">Stipend</span>
                                                            <span className="modern-value">
                                                                {selectedOffer.internship?.stipendMin} - {selectedOffer.internship?.stipendMax} {selectedOffer.internship?.stipendCurrency}
                                                            </span>
                                                        </div>
                                                        <div className="modern-detail-item">
                                                            <span className="modern-label">Duration</span>
                                                            <span className="modern-value">{selectedOffer.internship?.durationValue} {selectedOffer.internship?.durationUnit}</span>
                                                        </div>
                                                        <div className="modern-detail-item">
                                                            <span className="modern-label">Work Type</span>
                                                            <span className="modern-value">{selectedOffer.internship?.workType}</span>
                                                        </div>
                                                    </div>

                                                    <div className="modern-status-section">
                                                        <span className="status-label">Current Status</span>
                                                        <div className={`modern-status-badge ${selectedOffer.status.toLowerCase().replace('_', '-')}`}>
                                                            <span className="status-dot"></span>
                                                            {['OFFER_SENT', 'SELECTED'].includes(selectedOffer.status) ? 'Pending Your Action' :
                                                                selectedOffer.status === 'OFFER_DECLINED' ? 'Offer Declined' : 'Accepted & Joined'}
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Bottom Actions */}
                                                <div className="modern-offer-actions">
                                                    {['OFFER_SENT', 'SELECTED'].includes(selectedOffer.status) ? (
                                                        <div className="flex flex-col gap-4 w-full items-center">
                                                            <button
                                                                className="btn-primary"
                                                                style={{ width: '100%', maxWidth: '400px' }}
                                                                onClick={() => handleOfferResponse('OFFER_ACCEPTED')}
                                                                disabled={responding}
                                                            >
                                                                {responding ? 'Processing...' : 'Accept Offer & Join'}
                                                            </button>
                                                            <button
                                                                className="text-red-500 font-semibold hover:underline"
                                                                style={{ marginTop: '16px' }}
                                                                onClick={() => handleOfferResponse('OFFER_DECLINED')}
                                                                disabled={responding}
                                                            >
                                                                Decline Offer
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button className="btn-primary-download" style={{ minWidth: 'unset', width: '100%', maxWidth: '400px' }}>
                                                            Download Official Letter (PDF)
                                                        </button>
                                                    )}

                                                    <div className="secondary-links-row">
                                                        <button className="link-text-btn" onClick={() => navigate('/dashboard/student/applications')}>
                                                            Back to Applications
                                                        </button>
                                                        <button className="link-text-btn" onClick={() => navigate('/dashboard/student')}>
                                                            Dashboard
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
