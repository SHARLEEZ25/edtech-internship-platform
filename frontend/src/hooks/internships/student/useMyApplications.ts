import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { internshipsApi, type Application } from "@/api/internships.api";

export const useMyApplications = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);

    // Filter & Sort States
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [recruiterFilter, setRecruiterFilter] = useState('ALL');
    const [locationFilter, setLocationFilter] = useState('ALL');
    const [dateSort, setDateSort] = useState('DESC');

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await internshipsApi.getMyApplications();
            const data = response.data.data || response.data;
            setApplications(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message || "Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    // Derived Data
    const recruiters = useMemo(() =>
        Array.from(new Set(applications.map(app => app.internship?.recruiter?.companyName).filter((name): name is string => !!name))),
        [applications]);

    const locations = useMemo(() =>
        Array.from(new Set(applications.map(app => app.internship?.city).filter((city): city is string => !!city))),
        [applications]);

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
            const matchesRecruiter = recruiterFilter === 'ALL' || app.internship?.recruiter?.companyName === recruiterFilter;
            const matchesLocation = locationFilter === 'ALL' || app.internship?.city === locationFilter;
            return matchesStatus && matchesRecruiter && matchesLocation;
        }).sort((a, b) => {
            const timeA = new Date(a.appliedAt).getTime();
            const timeB = new Date(b.appliedAt).getTime();
            return dateSort === 'DESC' ? timeB - timeA : timeA - timeB;
        });
    }, [applications, statusFilter, recruiterFilter, locationFilter, dateSort]);

    // Handlers
    const handleApplicationAction = useCallback((application: Application) => {
        navigate(`/dashboard/student/internships/${application.internshipId}`);
    }, [navigate]);

    return {
        loading,
        error,
        applications: filteredApplications,
        recruiters,
        locations,
        filters: {
            status: statusFilter,
            recruiter: recruiterFilter,
            location: locationFilter,
            dateSort
        },
        setFilters: {
            setStatus: setStatusFilter,
            setRecruiter: setRecruiterFilter,
            setLocation: setLocationFilter,
            setDateSort
        },
        handleApplicationAction,
        refetch: fetchApplications,
        allApplications: applications,
    };
};
