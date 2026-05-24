import { useState, useEffect, useCallback } from 'react';
import { studentProfileApi, type StudentProfileData } from '@/api/studentProfile.api';

export const useRecruiterViewStudentProfile = (studentId: string | undefined) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<StudentProfileData | null>(null);
    const [skills, setSkills] = useState<string[]>([]);
    const [achievements, setAchievements] = useState<any[]>([]);

    const fetchProfile = useCallback(async () => {
        if (!studentId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await studentProfileApi.getStudentProfileById(studentId);
            const data = response.data.data;

            if (data) {
                // Map categories back to icons (same logic as useStudentProfile)
                const categoryToIcon: Record<string, string> = {
                    'PREMIUM': 'workspace_premium',
                    'VERIFIED': 'verified',
                    'AWARD': 'military_tech',
                    'STAR': 'star'
                };

                const mappedAchievements = (data.achievements || []).map((ach: any) => ({
                    ...ach,
                    icon: ach.category ? categoryToIcon[ach.category] : ach.icon
                }));

                setProfile(data);

                // Format skills: Map objects to strings if necessary
                const skillNames = (data.skills || []).map((s: any) => typeof s === 'object' ? s.name : s);
                setSkills(skillNames);
                setAchievements(mappedAchievements);
            }
        } catch (err: any) {
            console.error("Failed to fetch student profile", err);
            setError(err.message || "Failed to load student profile");
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        skills,
        achievements,
        loading,
        error,
        refetch: fetchProfile
    };
};
