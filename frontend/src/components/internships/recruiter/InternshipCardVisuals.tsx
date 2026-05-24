// Presentational component for an internship card in the recruiter view.
import type { Internship } from '../../../api/internships.api';
import '../../../styles/internships/recruiter/internship-card.css';
import { getInitials, getAvatarColor } from '@/utils/internshipFormatters';

interface InternshipCardVisualsProps {
    internship: Internship;
    statusClass: string;
    statusLabel: string;
    locationDisplay: string;
    stipendDisplay: string;
    durationDisplay: string;
    applicantCount: number;
    applicants: {
        id: string;
        name: string;
        avatar?: string | null;
    }[];
    onEdit: (id: string) => void;
    onView: (id: string) => void;
}

export const InternshipCardVisuals: React.FC<InternshipCardVisualsProps> = ({
    internship,
    statusClass,
    statusLabel,
    locationDisplay,
    stipendDisplay,
    durationDisplay,
    applicantCount,
    applicants,
    onEdit,
    onView
}) => {
    // Determine button text and action based on status
    const isDraft = internship.status === 'DRAFT';
    const isClosed = internship.status === 'CLOSED';

    const actionButtonAction = isDraft ? onEdit : onView;

    return (
        <div className={`internship-card-premium ${statusClass}`}>
            {/* 1. Header with Status Badge */}
            <div className="card-header-premium">
                <div className="title-status-row">
                    <h3 className="card-title-main">{internship.title}</h3>
                    <div className={`status-badge-pill ${statusClass}`}>
                        {internship.status === 'LIVE' && <span className="status-dot-icon">●</span>}
                        {internship.status === 'DRAFT' && <span className="material-symbols-outlined status-icon-small">edit_note</span>}
                        {internship.status === 'CLOSED' && <span className="material-symbols-outlined status-icon-small">lock</span>}
                        {statusLabel}
                    </div>
                </div>
                <p className="card-company-text">Thozhil Platform</p>
            </div>

            {/* 2. Details with Modern Icons */}
            <div className="card-details-premium">
                <div className="detail-row">
                    <span className="material-symbols-outlined detail-icon-mini">location_on</span>
                    {locationDisplay}
                </div>
                <div className="detail-row">
                    <span className="material-symbols-outlined detail-icon-mini">payments</span>
                    {stipendDisplay}
                </div>
                <div className="detail-row">
                    <span className="material-symbols-outlined detail-icon-mini">schedule</span>
                    {durationDisplay}
                </div>
            </div>

            <div className="card-divider"></div>

            {/* 3. Footer with Applicants & Actions */}
            <div className="card-footer-premium">
                <div className="applicants-info-group">
                    <span className="applicants-header-label">APPLICANTS</span>
                    {isDraft ? (
                        <span className="not-published-text">Not Published</span>
                    ) : (
                        <div className="applicants-visual-row">
                            {applicantCount > 0 ? (
                                <>
                                    <div className="applicant-avatars-stack">
                                        {(applicants || []).map((app, index) => (
                                            app.avatar ? (
                                                <img
                                                    key={app.id}
                                                    src={app.avatar}
                                                    alt={app.name}
                                                    className="stack-avatar"
                                                    title={app.name}
                                                    style={{ zIndex: 3 - index }}
                                                />
                                            ) : (
                                                <div
                                                    key={app.id}
                                                    className="stack-avatar initial-avatar"
                                                    style={{ backgroundColor: getAvatarColor(app.name), zIndex: 3 - index, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff' }}
                                                    title={app.name}
                                                >
                                                    {getInitials(app.name)}
                                                </div>
                                            )
                                        ))}
                                        {applicantCount > 3 && <div className="stack-more">+{applicantCount - 3}</div>}
                                    </div>
                                    <span className="total-count-text">{applicantCount} Total</span>
                                </>
                            ) : (
                                <span className="no-applicants-yet">No applicants yet</span>
                            )}
                        </div>
                    )}
                </div>

                <div className="card-actions-row">
                    {!isClosed && !isDraft && (
                        <button className="btn-icon-circular" onClick={() => onEdit(internship.id)}>
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                    )}
                    <button
                        className={`btn-action-premium ${isDraft ? 'btn-draft-mode' : isClosed ? 'btn-closed-mode' : 'btn-open-mode'}`}
                        onClick={() => actionButtonAction(internship.id)}
                    >
                        {isDraft ? 'Continue Editing' : isClosed ? 'View Details' : 'View'}
                    </button>
                </div>
            </div>
        </div>
    );
};
