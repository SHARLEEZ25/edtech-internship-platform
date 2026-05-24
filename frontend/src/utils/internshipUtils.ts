import { type InternshipFormData } from '@/components/internships/recruiter';

/**
 * Transforms form data into the format expected by the API
 */
export const transformInternshipDataForBackend = (data: InternshipFormData) => {
    const payload: any = {
        ...data,
        applicationDeadline: new Date(data.applicationDeadline).toISOString(),
        // Split textareas by newline and clean items
        skills: data.skills.split('\n').map(s => s.trim()).filter(s => s !== ''),
        requirements: data.requirements.split('\n').map(s => s.trim()).filter(s => s !== ''),
        responsibilities: data.responsibilities.split('\n').map(s => s.trim()).filter(s => s !== ''),
        stipendPeriod: data.stipendMin ? "MONTH" : undefined,
    };

    // Clean empty values to avoid backend validation issues
    Object.keys(payload).forEach(key => {
        if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
            delete payload[key];
        }
    });

    return payload;
};
