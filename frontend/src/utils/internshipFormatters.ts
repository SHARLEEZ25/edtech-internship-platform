import type { Internship } from '@/api/internships.api';

/**
 * Utility functions for formatting internship data for display
 * These handle all business logic for data transformation
 */

export const getStatusClass = (status: string): string => {
    switch (status) {
        case 'LIVE': return 'status-open';
        case 'DRAFT': return 'status-draft';
        case 'CLOSED': return 'status-closed';
        default: return '';
    }
};

export const getStatusLabel = (status: string): string => {
    switch (status) {
        case 'LIVE': return 'Open';
        case 'DRAFT': return 'Draft';
        case 'CLOSED': return 'Closed';
        case 'SELECTED': return 'Selected';
        default: return 'New';
    }
};

/**
 * Student Dashboard Specific Formatters
 */
export const getStudentApplicationStatusClass = (status: string): string => {
    const s = status.toUpperCase();
    switch (s) {
        case 'APPLIED': return 'status-applied';
        case 'SHORTLISTED': return 'status-shortlisted';
        case 'INTERVIEW': return 'status-interview';
        case 'SELECTED': return 'status-selected';
        case 'REJECTED': return 'status-rejected';
        default: return 'status-pending';
    }
};

export const getStudentApplicationStatusText = (status: string): string => {
    const s = status.toUpperCase();
    switch (s) {
        case 'APPLIED': return 'Applied';
        case 'SHORTLISTED': return 'Shortlisted';
        case 'INTERVIEW': return 'Under Interview';
        case 'SELECTED': return 'Selected';
        case 'REJECTED': return 'Rejected';
        default: return status;
    }
};

export const getApplicationStatusClass = (status: string): string => {
    switch (status) {
        case 'APPLIED': return 'badge-new';
        case 'SHORTLISTED': return 'badge-shortlisted';
        case 'REJECTED': return 'badge-rejected';
        case 'SELECTED': return 'badge-selected';
        case 'INTERVIEW': return 'badge-interview';
        default: return 'badge-new';
    }
};

export const getApplicationStatusText = (status: string): string => {
    switch (status) {
        case 'APPLIED': return 'New';
        case 'SHORTLISTED': return 'Shortlisted';
        case 'REJECTED': return 'Rejected';
        case 'SELECTED': return 'Selected';
        case 'INTERVIEW': return 'Interview';
        default: return status;
    }
};

export const formatStipend = (internship: Internship): string => {
    if (!internship.stipendMin && !internship.stipendMax) return 'Unpaid';

    const currency = internship.stipendCurrency || 'INR';
    const symbol = currency === 'INR' ? '₹' : '$';

    if (internship.stipendMin && internship.stipendMax) {
        return `${symbol}${internship.stipendMin.toLocaleString()} - ${symbol}${internship.stipendMax.toLocaleString()}`;
    }
    return `${symbol}${(internship.stipendMin || internship.stipendMax)?.toLocaleString()}`;
};

export const formatDuration = (internship: Internship): string => {
    const unit = internship.durationUnit === 'MONTHS' ? 'Month' : 'Week';
    const plural = internship.durationValue > 1 ? 's' : '';
    return `${internship.durationValue} ${unit}${plural} Duration`;
};

export const getLocationDisplay = (internship: Internship): string => {
    if (internship.internshipType === 'REMOTE') return 'Remote';
    if (internship.city && internship.state) return `${internship.city}, ${internship.state}`;
    if (internship.city) return internship.city;
    if (internship.state) return internship.state;
    return 'Location not specified';
};

export const getApplicantMessage = (applicantCount: number, status: string): string => {
    if (applicantCount > 0) return '';
    return status === 'DRAFT' ? 'Not Published' : 'No applicants yet';
};

export const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Posted just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Posted ${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Posted ${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Posted yesterday';
    if (diffInDays < 7) return `Posted ${diffInDays}d ago`;

    return `Posted on ${date.toLocaleDateString()}`;
};

export const getInitials = (name: string): string => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
};

export const getAvatarColor = (name: string): string => {
    if (!name) return '#94a3b8';
    const colors = [
        '#4285F4', // Google Blue
        '#34A853', // Google Green
        '#FBBC05', // Google Yellow
        '#EA4335', // Google Red
        '#9333ea', // Purple
        '#4f46e5', // Indigo
        '#0891b2', // Cyan
        '#db2777', // Pink
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};
