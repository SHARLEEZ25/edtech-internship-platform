// Card component displaying summary of an internship for students.
import React from 'react';
import { Link } from 'react-router-dom';
import { type Internship } from '@/api/internships.api';
import { isDeadlinePassed } from '@/utils/dateUtils';

interface InternshipCardProps {
    internship: Internship;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {

    const isExpired = isDeadlinePassed(internship.applicationDeadline);

    // Helper to get badge class
    const getBadgeClass = (text: string, type: 'domain' | 'type' | 'urgent' | 'closed') => {
        if (type === 'closed') return 'badge-red';
        if (type === 'urgent') return 'badge-red';
        if (type === 'type') {
            if (text === 'REMOTE') return 'badge-green';
            if (text === 'HYBRID') return 'badge-purple';
            return 'badge-gray';
        }
        // Domains
        if (text === 'Design') return 'badge-purple';
        if (text === 'Marketing') return 'badge-yellow';
        if (text === 'Engineering' || text === 'Tech') return 'badge-blue';
        if (text === 'Data Science') return 'badge-blue'; // Matches Tech in design
        if (text === 'Business') return 'badge-green';
        return 'badge-blue'; // Default
    };

    return (
        <div className="internship-card">
            {/* [VISUAL STATE]: Card Header. Title and company name. */}
            <div className="card-header">
                <h3 className="internship-title">{internship.title}</h3>
                <span className="company-name">{internship.recruiter?.companyName || 'Confidential'}</span>
            </div>

            {/* [VISUAL STATE]: Card Details. Stipend, location, and type info. */}
            <div className="card-details">
                <div className="detail-item">
                    <span className="material-symbols-outlined detail-icon">payments</span>
                    <span className="stipend-text">
                        {internship.stipendMin
                            ? `₹${internship.stipendMin.toLocaleString()}/month`
                            : 'Unpaid'}
                    </span>
                </div>
                <div className="detail-item">
                    <span className="material-symbols-outlined detail-icon">location_on</span>
                    <span>{internship.city || 'Remote'}</span>
                </div>
                <div className="detail-item">
                    <span className="material-symbols-outlined detail-icon">hourglass_empty</span>
                    <span>
                        {internship.durationValue} {internship.durationUnit === 'MONTHS' ? 'Month' : 'Week'}{internship.durationValue && internship.durationValue > 1 ? 's' : ''}
                    </span>
                </div>
                <div className="detail-item">
                    <span className="material-symbols-outlined detail-icon">business_center</span>
                    <span>{internship.internshipType === 'REMOTE' ? 'Remote' :
                        internship.internshipType === 'ONSITE' ? 'On-site' :
                            internship.internshipType}</span>
                </div>
            </div>

            <div className="card-badges">
                <span className={`badge ${getBadgeClass(internship.domain, 'domain')}`}>{internship.domain}</span>

                {/* Status/Type badges based on design */}
                {internship.internshipType === 'REMOTE' && (
                    <span className={`badge ${getBadgeClass('REMOTE', 'type')}`}>Remote</span>
                )}

                {/* Status Badges */}
                {isExpired ? (
                    <span className={`badge ${getBadgeClass('Closed', 'closed')}`}>Closed</span>
                ) : (
                    // Show Urgent only if not expired and within 7 days
                    internship.applicationDeadline && new Date(internship.applicationDeadline).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 && (
                        <span className={`badge ${getBadgeClass('Urgent', 'urgent')}`}>Urgent</span>
                    )
                )}
            </div>

            {/* [VISUAL STATE]: Primary Action. Link to view full details. */}
            <Link to={`/dashboard/student/internships/${internship.id}`} className="view-details-btn">
                View Details
            </Link>
        </div>
    );
};
