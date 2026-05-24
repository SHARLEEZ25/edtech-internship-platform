import { useState, useEffect, useCallback } from 'react';
import { internshipsApi, type Application } from '@/api/internships.api';

export const useRecruiterApplications = (internshipId?: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [internshipTitle, setInternshipTitle] = useState<string>('Applications');

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (internshipId) {
                // Fetch specific internship applications
                const [appsRes, intRes] = await Promise.all([
                    internshipsApi.getInternshipApplications(internshipId),
                    internshipsApi.getInternshipById(internshipId)
                ]);

                setApplications(appsRes.data.data);
                setInternshipTitle(intRes.data.data.title);
            } else {
                // Fetch all recruiter applications globally
                const response = await internshipsApi.getRecruiterApplicationsGlobal();
                setApplications(response.data.data);
                setInternshipTitle('All Applications');
            }
        } catch (err: any) {
            console.error('Error fetching recruiter applications:', err);
            setError(err.message || 'Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    }, [internshipId]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    return {
        loading,
        error,
        applications,
        internshipTitle,
        count: applications.length,
        refetch: fetchApplications
    };
};
