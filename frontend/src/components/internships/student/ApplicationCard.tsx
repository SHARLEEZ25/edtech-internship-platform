// Card component displaying details of a single application.
import React from 'react';
import { Link } from 'react-router-dom';
import { type Application } from '@/api/internships.api';

interface ApplicationCardProps {
    application: Application;
    onAction: (app: Application) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onAction }) => {
    const { internship, status, appliedAt } = application;
    const companyName = internship?.recruiter?.companyName || 'Unknown Company';
    const recruiterId = internship?.recruiter?.id;
    const companyInitial = companyName.charAt(0).toUpperCase();

    // Status helpers
    const getStatusText = (status: string) => {
        return status.replace(/_/g, ' ').toLowerCase();
    };

    const getStatusClass = (status: string) => {
        return `status-${status.toLowerCase()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Visual logic for button text/style
    const renderActionButton = () => {
        if (status === 'INTERVIEW') {
            return (
                <button
                    className="btn-view-details btn-primary-soft"
                    onClick={() => onAction(application)}
                >
                    View Application
                </button>
            );
        }

        if (status === 'SELECTED') {
            return (
                <button
                    className="btn-view-details btn-primary-soft"
                    onClick={() => onAction(application)}
                >
                    View Offer Letter
                </button>
            );
        }

        // For APPLIED, REJECTED, etc.
        return (
            <button
                className={`btn-view-details ${status === 'APPLIED' ? 'btn-primary-soft' : 'btn-secondary'}`}
                onClick={() => onAction(application)}
            >
                {status === 'REJECTED' ? 'View Feedback' : 'View Details'}
            </button>
        );
    };

    return (
        <div className="application-card">
            {/* [VISUAL STATE]: Card Header. Role title and application status. */}
            <div className="card-header">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#f1f5f9',
                            color: '#4f86f7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '1.25rem',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        {companyInitial}
                    </div>
                    <div>
                        <h3 className="role-title">{internship?.title || 'Unknown Role'}</h3>
                        {recruiterId ? (
                            <Link to={`/dashboard/student/companies/${recruiterId}`} className="company-name hover:underline block" style={{ textDecoration: 'none' }}>
                                {companyName}
                            </Link>
                        ) : (
                            <p className="company-name">{companyName}</p>
                        )}
                    </div>
                </div>
                <span className={`status-badge ${getStatusClass(status)}`}>
                    {getStatusText(status)}
                </span>
            </div>

            {/* [VISUAL STATE]: Card Details. Date applied and stipend. */}
            <div className="card-details">
                <div className="detail-item">
                    <span className="material-symbols-outlined detail-icon">calendar_month</span>
                    <span>Applied on {formatDate(appliedAt)}</span>
                </div>
                <div className="detail-item">
                    <span className="material-symbols-outlined detail-icon">location_on</span>
                    <span>{internship?.city || 'Remote'}</span>
                </div>
                <div className="detail-item">
                    <span className="material-symbols-outlined detail-icon">payments</span>
                    <span>
                        {internship?.stipendMin
                            ? `${internship.stipendCurrency === 'INR' ? '₹' : (internship.stipendCurrency || '$')}${internship.stipendMin.toLocaleString()} / month`
                            : 'Unpaid Internship'}
                    </span>
                </div>
            </div>

            {/* [VISUAL STATE]: Action Buttons. Contextual actions based on status. */}
            <div className="card-actions">
                {renderActionButton()}
            </div>
        </div>
    );
};
