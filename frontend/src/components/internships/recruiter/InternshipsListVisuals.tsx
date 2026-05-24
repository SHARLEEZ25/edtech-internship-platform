// Visual list layout for displaying multiple internship cards.
import type { Internship } from '../../../api/internships.api';
import { LoadingState } from '@/components/common/LoadingState';
import { InternshipCardVisuals } from './InternshipCardVisuals';
import '../../../styles/internships/recruiter/internships-list.css';

export interface FormattedInternshipCard {
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
}

interface InternshipsListVisualsProps {
    formattedInternships: FormattedInternshipCard[];
    onEdit: (id: string) => void;
    onView: (id: string) => void;
    onCreateNew: () => void;
    loading?: boolean;
}

export const InternshipsListVisuals: React.FC<InternshipsListVisualsProps> = ({
    formattedInternships,
    onEdit,
    onView,
    onCreateNew,
    loading = false
}) => {
    if (loading) {
        return <LoadingState size="medium" />;
    }

    return (
        <div className="internships-grid">
            {/* [VISUAL STATE]: List Grid. Renders a card for each internship. */}
            {formattedInternships.map((formatted) => (
                <InternshipCardVisuals
                    key={formatted.internship.id}
                    internship={formatted.internship}
                    statusClass={formatted.statusClass}
                    statusLabel={formatted.statusLabel}
                    locationDisplay={formatted.locationDisplay}
                    stipendDisplay={formatted.stipendDisplay}
                    durationDisplay={formatted.durationDisplay}
                    applicantCount={formatted.applicantCount}
                    applicants={formatted.applicants}
                    onEdit={onEdit}
                    onView={onView}
                />
            ))}

            {/* Create New Internship Placeholder Card */}
            <div className="create-new-card" onClick={onCreateNew}>
                <div className="create-new-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M24 16V32M16 24H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <h3 className="create-new-title">Create New Internship</h3>
                <p className="create-new-subtitle">Draft a new job posting</p>
            </div>
        </div>
    );
};
