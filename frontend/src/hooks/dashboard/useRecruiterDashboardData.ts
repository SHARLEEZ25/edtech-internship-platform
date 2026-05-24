import { useState, useEffect } from 'react';
import { internshipsApi } from '@/api/internships.api';
import type { Internship, Application } from '@/api/internships.api';

export interface RecruiterDashboardStats {
    totalInternships: number;
    totalApplications: number;
    interviewsScheduled: number;
    offersSent: number;
    activeInternships: number;
    internshipsThisWeek: number;
    applicationsThisWeek: number;
}

export interface RecruiterDashboardInternship {
    id: string;
    title: string;
    domain: string;
    createdAt: string;
    applicantCount: number;
    status: string;
    applicants: {
        id: string;
        name: string;
        avatar?: string | null;
    }[];
}

export interface RecruiterDashboardApplication {
    id: string;
    candidateName: string;
    candidateEmail: string;
    role: string;
    appliedDate: string;
    status: string;
    avatar?: string | null;
}

export interface RecruiterDashboardInterview {
    id: string;
    candidateName: string;
    role: string;
    time: string;
    date: string;
    day: number;
    month: string;
}

export interface StatItem {
    label: string;
    value: string;
    icon: string;
    trend: string;
    trendType: 'blue' | 'green' | 'yellow';
    cardType: 'blue' | 'green' | 'yellow' | 'indigo';
}

export const useRecruiterDashboardData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<RecruiterDashboardStats>({
        totalInternships: 0,
        totalApplications: 0,
        interviewsScheduled: 0,
        offersSent: 0,
        activeInternships: 0,
        internshipsThisWeek: 0,
        applicationsThisWeek: 0
    });
    const [activeInternships, setActiveInternships] = useState<RecruiterDashboardInternship[]>([]);
    const [recentApplications, setRecentApplications] = useState<RecruiterDashboardApplication[]>([]);
    const [upcomingInterviews, setUpcomingInterviews] = useState<RecruiterDashboardInterview[]>([]);
    const [statItems, setStatItems] = useState<StatItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                // 1. Fetch Recruiter's Internships
                const internshipsRes = await internshipsApi.getAllInternships();
                const realInternships: Internship[] = internshipsRes.data.internships || [];

                // 2. Fetch All Applications to this recruiter
                const appsRes = await internshipsApi.getRecruiterApplicationsGlobal();
                const realApps: Application[] = appsRes.data.data || [];

                // Helper for date comparison (last 7 days)
                const isThisWeek = (dateString: string) => {
                    const date = new Date(dateString);
                    const now = new Date();
                    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
                    return date >= sevenDaysAgo;
                };

                // 3. Calculate Stats
                const statsData: RecruiterDashboardStats = {
                    totalInternships: realInternships.length,
                    totalApplications: realApps.length,
                    interviewsScheduled: realApps.filter(a => a.status === 'INTERVIEW').length,
                    offersSent: realApps.filter(a => a.status === 'SELECTED').length,
                    activeInternships: realInternships.filter(i => i.status === 'LIVE').length,
                    internshipsThisWeek: realInternships.filter(i => isThisWeek(i.createdAt)).length,
                    applicationsThisWeek: realApps.filter(a => isThisWeek(a.appliedAt)).length
                };
                setStats(statsData);

                // 4. Map Active Internships
                const mappedInternships: RecruiterDashboardInternship[] = realInternships
                    .filter(i => i.status === 'LIVE')
                    .slice(0, 3)
                    .map(i => {
                        const internshipApps = realApps.filter(a => a.internshipId === i.id);
                        return {
                            id: i.id,
                            title: i.title,
                            domain: i.domain,
                            createdAt: i.createdAt,
                            applicantCount: i._count?.applications || 0,
                            status: i.status,
                            applicants: internshipApps.slice(0, 3).map(a => ({
                                id: a.id,
                                name: a.student?.user?.fullName || a.student?.fullName || a.fullName || 'Unknown',
                                avatar: (a as any).profilePicture || (a.student as any)?.profilePicture || a.student?.user?.profilePicture || null
                            }))
                        };
                    });
                setActiveInternships(mappedInternships);

                // 5. Map Recent Applications
                const mappedApps: RecruiterDashboardApplication[] = realApps
                    .slice(0, 5)
                    .map(a => ({
                        id: a.id,
                        candidateName: a.student?.user?.fullName || a.student?.fullName || a.fullName || 'Unknown',
                        candidateEmail: a.student?.user?.email || a.student?.email || a.email || '',
                        role: a.internship?.title || 'Unknown Role',
                        appliedDate: a.appliedAt,
                        status: a.status,
                        avatar: (a as any).profilePicture || (a.student as any)?.profilePicture || a.student?.user?.profilePicture || null
                    }));
                setRecentApplications(mappedApps);

                // 6. Map Real Interviews
                const realInterviews: RecruiterDashboardInterview[] = realApps
                    .filter(a => a.status === 'INTERVIEW')
                    .map((a) => {
                        const interviewDate = new Date(a.updatedAt || a.appliedAt);
                        return {
                            id: a.id,
                            candidateName: a.student?.user?.fullName || a.student?.fullName || a.fullName || 'Unknown',
                            role: a.internship?.title || 'Unknown Role',
                            time: 'TBD', // Backend doesn't support specific scheduling yet
                            date: interviewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                            day: interviewDate.getDate(),
                            month: interviewDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
                        };
                    });

                setUpcomingInterviews(realInterviews.slice(0, 5));

                // 7. Map Stat Items for the component
                const mappedStatItems: StatItem[] = [
                    {
                        label: 'Internships Posted',
                        value: statsData.totalInternships.toString(),
                        icon: 'work',
                        trend: statsData.internshipsThisWeek > 0 ? `+${statsData.internshipsThisWeek} this week` : 'No new posts',
                        trendType: 'blue',
                        cardType: 'blue'
                    },
                    {
                        label: 'Total Applications',
                        value: statsData.totalApplications.toString(),
                        icon: 'description',
                        trend: statsData.applicationsThisWeek > 0 ? `+${statsData.applicationsThisWeek} this week` : 'Stable',
                        trendType: 'green',
                        cardType: 'green'
                    },
                    {
                        label: 'Interviews Scheduled',
                        value: statsData.interviewsScheduled.toString(),
                        icon: 'videocam',
                        trend: statsData.interviewsScheduled > 0 ? 'Active' : 'Pending',
                        trendType: 'yellow',
                        cardType: 'yellow'
                    },
                    {
                        label: 'Offers Sent',
                        value: statsData.offersSent.toString(),
                        icon: 'verified',
                        trend: statsData.offersSent > 0 ? 'Success' : '',
                        trendType: 'blue',
                        cardType: 'indigo'
                    },
                ];
                setStatItems(mappedStatItems);

            } catch (err: any) {
                console.error('Error fetching recruiter dashboard data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return {
        isLoading,
        stats,
        statItems,
        activeInternships,
        recentApplications,
        upcomingInterviews,
        error
    };
};
