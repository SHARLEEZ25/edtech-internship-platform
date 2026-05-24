import React from 'react';
import { type Internship } from '@/api/internships.api';
import '@/styles/internships/student/saved-internships.css';
import { LoadingState } from '@/components/common/LoadingState';

interface SavedInternshipsVisualsProps {
    internships: Internship[];
    loading: boolean;
    error: string | null;
    actionLoading: string | null;
    onUnsave: (id: string, e: React.MouseEvent) => void;
    onViewDetails: (id: string) => void;
    onBrowse: () => void;
}

export const SavedInternshipsVisuals: React.FC<SavedInternshipsVisualsProps> = ({
    internships,
    loading,
    error,
    actionLoading,
    onUnsave,
    onViewDetails,
    onBrowse
}) => {
    if (loading) {
        return <LoadingState size="medium" />;
    }

    // Helper to get tag class
    const getTagClass = (domain: string) => {
        const lowerDomain = domain.toLowerCase();
        if (lowerDomain.includes('science')) return 'saved-tag-science';
        if (lowerDomain.includes('tech')) return 'saved-tag-tech';
        if (lowerDomain.includes('marketing')) return 'saved-tag-marketing';
        if (lowerDomain.includes('design')) return 'saved-tag-design';
        return 'saved-tag-tech'; // default
    };

    const getTypeTagClass = (type: string) => {
        const lowerType = type.toLowerCase();
        if (lowerType === 'onsite') return 'saved-tag-onsite';
        if (lowerType === 'remote') return 'saved-tag-remote';
        if (lowerType === 'hybrid') return 'saved-tag-hybrid';
        return 'saved-tag-onsite'; // default
    };

    return (
        <div className="saved-internships-container">
            <div className="saved-header">
                <h1 className="saved-title">Saved Internships</h1>
                <p className="saved-subtitle">Your bookmarked opportunities</p>
            </div>

            {error && (
                <div className="saved-error-message">
                    <span className="material-symbols-outlined">error</span>
                    <p>{error}</p>
                </div>
            )}

            {internships.length === 0 ? (
                <div className="saved-empty-state">
                    <span className="material-symbols-outlined saved-empty-icon">bookmark_border</span>
                    <p>You haven't saved any internships yet.</p>
                    <button onClick={onBrowse} className="btn-primary">
                        Find Internships
                    </button>
                </div>
            ) : (
                <div className="saved-internships-grid">
                    {internships.map(internship => (
                        <div
                            key={internship.id}
                            className="saved-internship-card"
                            onClick={() => onViewDetails(internship.id)}
                        >
                            <div className="saved-card-header">
                                <div className="saved-card-info">
                                    <div className="saved-role-icon">
                                        <span className="material-symbols-outlined">work</span>
                                    </div>
                                    <h3 className="saved-internship-title">{internship.title}</h3>
                                    <p className="saved-company-name">{internship.recruiter?.companyName || 'Confidential'}</p>
                                </div>
                                <button
                                    className={`saved-bookmark-btn ${actionLoading === internship.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={(e) => !actionLoading && onUnsave(internship.id, e)}
                                    disabled={!!actionLoading}
                                    title="Unsave"
                                >
                                    {actionLoading === internship.id ? (
                                        <div className="premium-loader" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                    ) : (
                                        <span className="material-symbols-outlined">bookmark</span>
                                    )}
                                </button>
                            </div>

                            <div className="saved-card-tags">
                                <span className={`saved-tag ${getTagClass(internship.domain)}`}>
                                    {internship.domain}
                                </span>
                                <span className={`saved-tag ${getTypeTagClass(internship.internshipType)}`}>
                                    {internship.internshipType}
                                </span>
                            </div>

                            <div className="saved-card-footer">
                                <div className="saved-stipend">
                                    <span className="material-symbols-outlined">payments</span>
                                    {internship.stipendMin ? `₹${internship.stipendMin.toLocaleString()}` : 'Unpaid'}
                                </div>
                                <div className="saved-location">
                                    <span className="material-symbols-outlined">location_on</span>
                                    {internship.city || 'Remote'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
