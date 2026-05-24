import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../api/users.api';
import { recruitersApi, type RecruiterAchievementPayload, type RecruiterEngagementPayload, type RecruiterProfileUpdatePayload } from '../../api/recruiters.api';

export interface RecruiterProfileData {
    id?: string;
    // Recruiter Info
    recruiterName: string;
    professionalTitle: string;

    // Company Info
    companyName: string;
    tagline: string;
    location: string;
    isVerified: boolean;
    completionPercentage: number;
    isRichProfile?: boolean;
    about: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    stats: {
        studentsHired: number;
        activePostings: number;
        retentionRate: number;
        yearsOfExperience: number;
    };
    engagements: {
        id: string;
        title: string;
        subtitle: string;
        status: 'UPCOMING' | 'COMPLETED';
        icon: string;
    }[];
    hiringRoles: string[];
    achievements: {
        id: string;
        label: string;
        icon: string;
        colorClass: string;
    }[];
    headquarters: {
        address: string;
        city?: string;
        state?: string;
        mapImage?: string;
    };
    businessType?: string;
}

export const useRecruiterProfile = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [profileData, setProfileData] = useState<RecruiterProfileData>({
        recruiterName: '',
        professionalTitle: '',
        companyName: 'Company Name',
        tagline: 'Industry • Location',
        location: '',
        isVerified: false,
        completionPercentage: 20,
        about: 'Add a description about your company to attract the best talent.',
        stats: {
            studentsHired: 0,
            activePostings: 0,
            retentionRate: 0,
            yearsOfExperience: 0
        },
        engagements: [],
        hiringRoles: [],
        achievements: [],
        headquarters: {
            address: 'Add headquarters address',
            city: '',
            state: ''
        }
    });

    const fetchProfile = useCallback(async (isBackground = false) => {
        if (!user?.recruiterProfile?.id) {
            setIsLoading(false);
            return;
        }

        try {
            if (!isBackground) setIsLoading(true);
            else setIsRefreshing(true);

            const res = await usersApi.getRecruiterProfile(user.recruiterProfile.id);
            const data = res.data.data;

            const locationStr = [data.city, data.state].filter(Boolean).join(', ');

            // Dynamic completion calculation
            let completedFields = 0;
            const totalFields = 8;

            if (data.companyName && data.companyName !== 'Company Name') completedFields++;
            if (data.professionalTitle) completedFields++;
            if (data.companyDescription && data.companyDescription.length > 20) completedFields++;
            if (locationStr) completedFields++;
            if (data.hiringRoles && data.hiringRoles.length > 0) completedFields++;
            if (data.achievements && data.achievements.length > 0) completedFields++;
            if (data.engagements && data.engagements.length > 0) completedFields++;
            if (data.studentsHired > 0 || data.yearsOfExperience > 0) completedFields++;

            const percentage = Math.round((completedFields / totalFields) * 100);

            setProfileData({
                id: data.id,
                recruiterName: data.fullName || user.fullName || '',
                professionalTitle: data.professionalTitle || '',
                companyName: data.companyName || 'Company Name',
                tagline: `Industry • ${locationStr || 'Location'}`,
                location: locationStr,
                isVerified: true,
                completionPercentage: percentage,
                about: data.companyDescription || 'Add a description about your company to attract the best talent.',
                linkedinUrl: data.linkedinUrl,
                twitterUrl: data.twitterUrl,
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
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch profile');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleEditToggle = (section: string | null) => setEditingSection(section);

    const updateBasicProfile = async (updates: RecruiterProfileUpdatePayload) => {
        try {
            setIsRefreshing(true);
            await recruitersApi.updateProfile(updates);
            await fetchProfile(true);
            setEditingSection(null);
        } catch (err: any) {
            setError(err.message || 'Update failed');
            setIsRefreshing(false);
        }
    };

    const addAchievement = async (data: RecruiterAchievementPayload) => {
        try {
            setIsRefreshing(true);
            await recruitersApi.addAchievement(data);
            await fetchProfile(true);
        } catch (err: any) {
            setError(err.message || 'Failed to add achievement');
            setIsRefreshing(false);
        }
    };

    const deleteAchievement = async (id: string) => {
        try {
            setIsRefreshing(true);
            await recruitersApi.deleteAchievement(id);
            await fetchProfile(true);
        } catch (err: any) {
            setError(err.message || 'Failed to delete achievement');
            setIsRefreshing(false);
        }
    };

    const addEngagement = async (data: RecruiterEngagementPayload) => {
        try {
            setIsRefreshing(true);
            await recruitersApi.addEngagement(data);
            await fetchProfile(true);
        } catch (err: any) {
            setError(err.message || 'Failed to add engagement');
            setIsRefreshing(false);
        }
    };

    const deleteEngagement = async (id: string) => {
        try {
            setIsRefreshing(true);
            await recruitersApi.deleteEngagement(id);
            await fetchProfile(true);
        } catch (err: any) {
            setError(err.message || 'Failed to delete engagement');
            setIsRefreshing(false);
        }
    };

    const updateEngagement = async (id: string, updates: any) => {
        try {
            setIsRefreshing(true);
            await recruitersApi.updateEngagement(id, updates);
            await fetchProfile(true);
        } catch (err: any) {
            setError(err.message || 'Failed to update engagement');
            setIsRefreshing(false);
        }
    };

    return {
        profileData,
        isLoading,
        isRefreshing,
        editingSection,
        error,
        handleEditToggle,
        updateBasicProfile,
        addAchievement,
        deleteAchievement,
        addEngagement,
        deleteEngagement,
        updateEngagement,
        refreshProfile: fetchProfile
    };
};
