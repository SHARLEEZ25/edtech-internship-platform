import { useState, useEffect } from 'react';
import { internshipsApi } from '@/api/internships.api';
import { studentProfileApi } from '@/api/studentProfile.api';
import type { Application } from '@/api/internships.api';
import { getStudentApplicationStatusClass, getStudentApplicationStatusText } from '@/utils/internshipFormatters';

export interface DashboardInternship {
    id?: string;
    title: string;
    company: string;
    location: string;
    isHighlighted?: boolean;
    semanticMatch?: number;
    reason?: string;
}

export interface DashboardApplication {
    position: string;
    company: string;
    statusText: string;
    statusClass: string;
}

export interface DashboardInterview {
    id: string;
    position: string;
    company: string;
    date: string;
    time: string;
}

export const useDashboardData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [appliedInternships, setAppliedInternships] = useState<DashboardApplication[]>([]);
    const [recommendedInternships, setRecommendedInternships] = useState<DashboardInternship[]>([]);
    const [upcomingInterviews, setUpcomingInterviews] = useState<DashboardInterview[]>([]);
    const [profileStrength, setProfileStrength] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                // Fetch applications, recommended internships, and profile
                const [appsRes, internshipsRes, profileRes] = await Promise.all([
                    internshipsApi.getMyApplications(),
                    internshipsApi.getSemanticRecommendations(),
                    studentProfileApi.getProfile()
                ]);

                const realApps: Application[] = appsRes.data.data || [];
                const recommendationData = internshipsRes.data.data;
                const profileData = profileRes.data.data;

                // Set profile strength
                if (profileData && profileData.profileStrength !== undefined) {
                    setProfileStrength(profileData.profileStrength);
                }

                // Map real applications to the format expected by the UI
                const formattedApps: DashboardApplication[] = realApps.map(app => ({
                    position: app.internship?.title || 'Unknown Position',
                    company: app.internship?.recruiter?.companyName || 'Unknown Company',
                    statusText: getStudentApplicationStatusText(app.status),
                    statusClass: getStudentApplicationStatusClass(app.status)
                }));

                setAppliedInternships(formattedApps);

                // Extract and format interviews
                const interviewApps = realApps.filter(app => app.status === 'INTERVIEW');
                const formattedInterviews: DashboardInterview[] = interviewApps.map(app => {
                    const interviewDate = new Date(app.updatedAt || app.appliedAt);
                    return {
                        id: app.id,
                        position: app.internship?.title || 'Unknown Position',
                        company: app.internship?.recruiter?.companyName || 'Unknown Company',
                        date: interviewDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                        time: 'TBD'
                    };
                });
                setUpcomingInterviews(formattedInterviews);

                // Map real internships to the format expected by the UI
                // Map real internships to the format expected by the UI
                const finalRecommendations: DashboardInternship[] = [];

                if (recommendationData) {
                    // 1. Highlighted Match
                    if (recommendationData.highlighted) {
                        const h = recommendationData.highlighted;
                        finalRecommendations.push({
                            id: h.id,
                            title: h.title,
                            company: h.recruiter?.companyName || 'Unknown Company',
                            location: h.city && h.state ? `${h.city}, ${h.state}` : (h.city || h.state || 'Remote'),
                            isHighlighted: true,
                            semanticMatch: h.semanticMatch,
                            reason: h.reason
                        });
                    }

                    // 2. Standard List
                    if (recommendationData.list && Array.isArray(recommendationData.list)) {
                        recommendationData.list.forEach(l => {
                            finalRecommendations.push({
                                id: l.id,
                                title: l.title,
                                company: l.recruiter?.companyName || 'Unknown Company',
                                location: l.city && l.state ? `${l.city}, ${l.state}` : (l.city || l.state || 'Remote'),
                                isHighlighted: false,
                                semanticMatch: l.semanticMatch,
                                reason: l.reason
                            });
                        });
                    }
                }

                setRecommendedInternships(finalRecommendations);

            } catch (err: any) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Calculate stroke dash offset for circular progress (radius = 16)
    const circumference = 2 * Math.PI * 16;
    const profileProgressOffset = circumference - (profileStrength / 100) * circumference;

    return {
        appliedInternships,
        recommendedInternships,
        upcomingInterviews,
        profileStrength,
        profileProgressOffset,
        isLoading,
        error,
        appliedCount: appliedInternships.length
    };
};
