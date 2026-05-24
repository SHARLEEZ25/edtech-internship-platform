import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '@/api/users.api';
import { internshipsApi, type Internship } from '@/api/internships.api';
import type { RecruiterProfileData } from '@/hooks/profile/useRecruiterProfile';

export const useCompanyProfile = (recruiterId: string | undefined) => {
    const [profile, setProfile] = useState<RecruiterProfileData | null>(null);
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullProfile, setIsFullProfile] = useState(false);

    const fetchData = useCallback(async () => {
        if (!recruiterId) return;
        try {
            setLoading(true);
            setError(null);

            const [profileRes, internshipsRes] = await Promise.all([
                usersApi.getRecruiterProfile(recruiterId),
                internshipsApi.getAllInternships({ recruiterId, status: 'LIVE', includeApplied: true })
            ]);

            const data = profileRes.data.data;
            const locationStr = [data.city, data.state].filter(Boolean).join(', ');

            // Process data to match RecruiterProfileData structure (Read-Only version for Students)
            const processedProfile: RecruiterProfileData = {
                id: data.id,
                recruiterName: data.fullName || '',
                professionalTitle: data.professionalTitle || '',
                companyName: data.companyName || 'Company Name',
                tagline: `Industry • ${locationStr || 'Location'}`,
                location: locationStr,
                isVerified: true,
                completionPercentage: data.completionPercentage || 0,
                isRichProfile: data.isRichProfile || false,
                about: data.companyDescription || 'No description available for this company.',
                stats: {
                    studentsHired: data.studentsHired || 0,
                    activePostings: data.activePostings || 0,
                    retentionRate: data.retentionRate || 0,
                    yearsOfExperience: data.yearsOfExperience || 0
                },
                engagements: data.engagements || [],
                hiringRoles: data.hiringRoles || [],
                achievements: data.achievements || [],
                headquarters: {
                    address: locationStr || 'Add headquarters address',
                    city: data.city || '',
                    state: data.state || ''
                }
            };

            setProfile(processedProfile);
            setInternships(internshipsRes.data.internships || []);
        } catch (err: any) {
            console.error("Failed to load company profile", err);
            setError(err.message || 'Failed to load company profile');
        } finally {
            setLoading(false);
        }
    }, [recruiterId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleProfileView = () => setIsFullProfile(prev => !prev);

    return {
        profile,
        internships,
        loading,
        error,
        isFullProfile,
        toggleProfileView,
        refetch: fetchData
    };
};
