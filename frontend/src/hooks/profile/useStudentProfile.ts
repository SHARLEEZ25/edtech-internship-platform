import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { studentProfileApi, type Experience, type Achievement, type Engagement } from '@/api/studentProfile.api';

// Re-exporting types for consumers
export type { Experience, Achievement, Engagement };

export const useStudentProfile = () => {
    const { user } = useAuth();

    // Toggles for adding new items
    const [isAddingExp, setIsAddingExp] = useState(false);
    const [isAddingAch, setIsAddingAch] = useState(false);
    const [isAddingEngage, setIsAddingEngage] = useState(false);

    // Toggles for managing existing items (Edit/Delete mode)
    const [isManagingExp, setIsManagingExp] = useState(false);
    const [isManagingAch, setIsManagingAch] = useState(false);
    const [isManagingEngage, setIsManagingEngage] = useState(false);

    // ID of item currently being edited (null if adding new)
    const [editingExpId, setEditingExpId] = useState<string | null>(null);
    const [editingAchId, setEditingAchId] = useState<string | null>(null);
    const [editingEngageId, setEditingEngageId] = useState<string | null>(null);

    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [isEditingSkills, setIsEditingSkills] = useState(false);

    const [bioText, setBioText] = useState('');
    const [primaryRole, setPrimaryRole] = useState('');
    const [profileStrength, setProfileStrength] = useState(0);

    // Education & Location fields
    const [education, setEducation] = useState({
        collegeName: '',
        degree: '',
        graduationYear: null as number | null,
        specialization: ''
    });
    const [location, setLocation] = useState({
        city: '',
        state: ''
    });

    const [experience, setExperience] = useState<Experience[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [engagements, setEngagements] = useState<Engagement[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [localSkills, setLocalSkills] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Error states for UI feedback
    const [bioError, setBioError] = useState<string | null>(null);
    const [roleError, setRoleError] = useState<string | null>(null);
    const [expError, setExpError] = useState<string | null>(null);
    const [achError, setAchError] = useState<string | null>(null);
    const [engageError, setEngageError] = useState<string | null>(null);

    // Form states
    const [newExp, setNewExp] = useState<Omit<Experience, 'id'>>({
        title: '', company: '', duration: '', description: '', startDate: '', endDate: '', isCurrent: false
    });

    const [newAch, setNewAch] = useState<Omit<Achievement, 'id'>>({
        title: '', issuer: '', icon: 'workspace_premium'
    });

    const [newEngage, setNewEngage] = useState<Omit<Engagement, 'id'>>({
        title: '', detail: '', tag: 'CERTIFIED', icon: 'school'
    });

    const [socialLinks, setSocialLinks] = useState({
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: ''
    });

    const [isSavingBasic, setIsSavingBasic] = useState(false);

    // Initialize & Fetch Logic
    const fetchProfile = useCallback(async () => {
        try {
            // Fetch from API
            const res = await studentProfileApi.getProfile();
            const data = res.data.data;

            if (data) {
                // Map categories back to icons for display
                const categoryToIcon: Record<string, string> = {
                    'PREMIUM': 'workspace_premium',
                    'VERIFIED': 'verified',
                    'AWARD': 'military_tech',
                    'STAR': 'star'
                };

                const mappedAchievements = (data.achievements || []).map(ach => ({
                    ...ach,
                    icon: ach.category ? categoryToIcon[ach.category] : ach.icon
                }));

                setExperience(data.experiences || []);
                setAchievements(mappedAchievements);
                setEngagements(data.engagements || []);
                setBioText(data.about || "Passionate student looking to build a career in technology.");
                setPrimaryRole(data.headline || "Add your professional role");

                setEducation({
                    collegeName: data.collegeName || '',
                    degree: data.degree || '',
                    graduationYear: data.graduationYear || null,
                    specialization: data.specialization || ''
                });
                setLocation({
                    city: data.city || '',
                    state: data.state || ''
                });
                setSocialLinks({
                    linkedinUrl: data.linkedinUrl || '',
                    githubUrl: data.githubUrl || '',
                    portfolioUrl: data.portfolioUrl || ''
                });

                if (data.profileStrength !== undefined) {
                    setProfileStrength(data.profileStrength);
                }

                if (data.skills) {
                    const skillNames = data.skills.map((s: any) => typeof s === 'object' ? s.name : s);
                    setSkills(skillNames);
                    setLocalSkills(skillNames);
                }
            }
        } catch (err) {
            console.error("Failed to load profile:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user, fetchProfile]);

    // --- BIO & ROLE HANDLERS ---
    const handleSaveBio = async () => {
        setBioError(null);
        if (!bioText.trim()) {
            setBioError("Please enter a bio before saving.");
            return;
        }
        try {
            setIsSavingBasic(true);
            await studentProfileApi.updateBasicProfile({ about: bioText });
            await fetchProfile();
            setIsEditingBio(false);
        } catch (e) {
            setBioError('Failed to save bio');
        } finally {
            setIsSavingBasic(false);
        }
    };

    const handleSaveRole = async () => {
        setRoleError(null);
        if (!primaryRole.trim()) {
            setRoleError("Please enter your professional role.");
            return;
        }
        try {
            setIsSavingBasic(true);
            await studentProfileApi.updateBasicProfile({ headline: primaryRole });
            await fetchProfile();
            setIsEditingRole(false);
        } catch (e) {
            setRoleError('Failed to save role');
        } finally {
            setIsSavingBasic(false);
        }
    };

    const handleSaveBasic = async (updatedFields: any) => {
        try {
            setIsSavingBasic(true);
            await studentProfileApi.updateBasicProfile(updatedFields);
            await fetchProfile();
        } catch (e) {
            console.error("Failed to save basic info:", e);
        } finally {
            setIsSavingBasic(false);
        }
    };

    // --- EXPERIENCE HANDLERS ---
    const handleAddExperience = async () => {
        setExpError(null);
        if (!newExp.title.trim() || !newExp.company.trim()) {
            setExpError("Please enter both Role and Company name.");
            return;
        }

        if (!newExp.startDate) {
            setExpError("Please select a start date.");
            return;
        }

        if (!newExp.isCurrent && !newExp.endDate) {
            setExpError("Please select an end date or mark as 'Present'.");
            return;
        }

        const duration = newExp.isCurrent ? `${newExp.startDate} - Present` : `${newExp.startDate} - ${newExp.endDate}`;

        // Parse dates for API (Format: "Month Year")
        const [startMonth, startYear] = newExp.startDate ? newExp.startDate.split(' ') : [undefined, undefined];
        const [endMonth, endYear] = (!newExp.isCurrent && newExp.endDate) ? newExp.endDate.split(' ') : [null, null];

        const expData = {
            ...newExp,
            duration,
            startMonth,
            startYear,
            endMonth,
            endYear
        };

        try {
            if (editingExpId) {
                await studentProfileApi.updateExperience(editingExpId, expData);
            } else {
                await studentProfileApi.addExperience(expData);
            }

            await fetchProfile();
            setNewExp({ title: '', company: '', duration: '', description: '', startDate: '', endDate: '', isCurrent: false });
            setIsAddingExp(false);
            setEditingExpId(null);
        } catch (e) {
            setExpError('Failed to save experience');
        }
    };

    const startEditingExp = (exp: Experience) => {
        setExpError(null);
        setNewExp({ ...exp });
        setEditingExpId(exp.id);
        setIsAddingExp(true);
        setIsManagingExp(false);
    };

    const handleDeleteExperience = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        setExpError(null);
        try {
            await studentProfileApi.deleteExperience(id);
            await fetchProfile();
        } catch (e) {
            setExpError('Failed to delete experience');
        }
    };

    // --- ACHIEVEMENT HANDLERS ---
    const handleAddAchievement = async () => {
        setAchError(null);
        if (!newAch.title.trim() || !newAch.issuer.trim()) {
            setAchError("Please enter both the Achievement Title and Issuer.");
            return;
        }

        type AchCategory = 'PREMIUM' | 'VERIFIED' | 'AWARD' | 'STAR';

        // Map icons to backend expected categories
        const iconToCategory: Record<string, AchCategory> = {
            'workspace_premium': 'PREMIUM',
            'verified': 'VERIFIED',
            'military_tech': 'AWARD',
            'star': 'STAR'
        };

        const achData: Omit<Achievement, 'id'> & { category: AchCategory } = {
            ...newAch,
            category: iconToCategory[newAch.icon] || 'PREMIUM'
        };

        try {
            if (editingAchId) {
                await studentProfileApi.updateAchievement(editingAchId, achData);
            } else {
                await studentProfileApi.addAchievement(achData);
            }

            await fetchProfile();
            setNewAch({ title: '', issuer: '', icon: 'workspace_premium' });
            setIsAddingAch(false);
            setEditingAchId(null);
        } catch (e) {
            setAchError('Failed to save achievement');
        }
    };

    const startEditingAch = (ach: Achievement) => {
        setAchError(null);
        setNewAch({ ...ach });
        setEditingAchId(ach.id);
        setIsAddingAch(true);
        setIsManagingAch(false);
    };

    const handleDeleteAchievement = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        setAchError(null);
        try {
            await studentProfileApi.deleteAchievement(id);
            await fetchProfile();
        } catch (e) {
            setAchError('Failed to delete achievement');
        }
    };

    // --- ENGAGEMENT HANDLERS ---
    const handleAddEngagement = async () => {
        setEngageError(null);
        if (!newEngage.title.trim() || !newEngage.detail.trim()) {
            setEngageError("Please enter both the Engagement Title and Details.");
            return;
        }

        try {
            if (editingEngageId) {
                await studentProfileApi.updateEngagement(editingEngageId, newEngage);
            } else {
                await studentProfileApi.addEngagement(newEngage);
            }

            await fetchProfile();
            setNewEngage({ title: '', detail: '', tag: 'CERTIFIED', icon: 'school' });
            setIsAddingEngage(false);
            setEditingEngageId(null);
        } catch (e) {
            setEngageError('Failed to save engagement');
        }
    };

    const startEditingEngage = (item: Engagement) => {
        setEngageError(null);
        setNewEngage({ ...item });
        setEditingEngageId(item.id);
        setIsAddingEngage(true);
        setIsManagingEngage(false);
    };

    const handleDeleteEngagement = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        setEngageError(null);
        try {
            await studentProfileApi.deleteEngagement(id);
            await fetchProfile();
        } catch (e) {
            setEngageError('Failed to delete engagement');
        }
    };

    // --- SKILLS HANDLER ---
    const handleUpdateSkills = async () => {
        try {
            setIsSavingBasic(true);
            await studentProfileApi.updateSkills(localSkills);
            await fetchProfile();
            setIsEditingSkills(false);
        } catch (e) {
            console.error("Failed to update skills:", e);
        } finally {
            setIsSavingBasic(false);
        }
    };

    return {
        user,
        loading,
        isEditingBio, isEditingRole,
        isAddingExp, isAddingAch, isAddingEngage,
        isManagingExp, isManagingAch, isManagingEngage,
        editingExpId, editingAchId, editingEngageId,
        bioText, primaryRole,
        experience, achievements, engagements,
        newExp, newAch, newEngage,
        bioError, roleError, expError, achError, engageError,
        setBioText, setPrimaryRole,
        setNewExp, setNewAch, setNewEngage,
        profileStrength,
        skills, localSkills, setLocalSkills,
        isEditingSkills,
        // Combined profile data for easy usage in components
        profile: {
            ...user,
            about: bioText,
            headline: primaryRole,
            ...education,
            ...location,
            ...socialLinks
        },
        handleSaveBio, handleSaveRole,
        handleSaveBasic,
        handleUpdateSkills,
        socialLinks,
        setSocialLinks,
        isSavingBasic,
        education, setEducation,
        location, setLocation,
        handleAddExperience, handleDeleteExperience, startEditingExp,
        handleAddAchievement, handleDeleteAchievement, startEditingAch,
        handleAddEngagement, handleDeleteEngagement, startEditingEngage,
        toggleEditBio: () => {
            setIsEditingBio(!isEditingBio);
            setBioError(null);
        },
        toggleEditRole: () => {
            setIsEditingRole(!isEditingRole);
            setRoleError(null);
        },
        toggleAddExp: () => {
            setIsAddingExp(!isAddingExp);
            setExpError(null);
            if (!isAddingExp) {
                setEditingExpId(null);
                setNewExp({ title: '', company: '', duration: '', description: '', startDate: '', endDate: '', isCurrent: false });
            }
        },
        toggleAddAch: () => {
            setIsAddingAch(!isAddingAch);
            setAchError(null);
            if (!isAddingAch) {
                setEditingAchId(null);
                setNewAch({ title: '', issuer: '', icon: 'workspace_premium' });
            }
        },
        toggleAddEngage: () => {
            setIsAddingEngage(!isAddingEngage);
            setEngageError(null);
            if (!isAddingEngage) {
                setEditingEngageId(null);
                setNewEngage({ title: '', detail: '', tag: 'CERTIFIED', icon: 'school' });
            }
        },
        toggleManageExp: () => {
            setIsManagingExp(!isManagingExp);
            setExpError(null);
        },
        toggleManageAch: () => {
            setIsManagingAch(!isManagingAch);
            setAchError(null);
        },
        toggleManageEngage: () => {
            setIsManagingEngage(!isManagingEngage);
            setEngageError(null);
        },
        toggleEditSkills: () => {
            setIsEditingSkills(!isEditingSkills);
            if (!isEditingSkills) {
                setLocalSkills(skills); // Reset on open/cancel
            }
        }
    };
};
