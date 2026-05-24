import { useState, useEffect, useCallback } from 'react';
import { internshipsApi, type Internship } from '@/api/internships.api';
import { uploadApi } from '@/api/upload.api';
import { useAuth } from '@/context/AuthContext';

export interface ApplyFormState {
    fullName: string;
    email: string;
    phone: string;
    countryCode: string;
    linkedinUrl: string;
    portfolioUrl: string;
    githubUrl: string;
    coverLetter: string;
    resumeFile: File | null;
}

export const useApplyInternship = (internshipId: string | undefined) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [internship, setInternship] = useState<Internship | null>(null);

    const [form, setForm] = useState<ApplyFormState>({
        fullName: '',
        email: '',
        phone: '',
        countryCode: '+91', // Default
        linkedinUrl: '',
        portfolioUrl: '',
        githubUrl: '',
        coverLetter: '',
        resumeFile: null
    });

    const fetchInternship = useCallback(async () => {
        if (!internshipId) return;
        try {
            setFetchLoading(true);
            const res = await internshipsApi.getInternshipById(internshipId);
            setInternship(res.data.data);
        } catch (err: any) {
            console.error("Failed to load internship", err);
            setError("Failed to load internship details");
        } finally {
            setFetchLoading(false);
        }
    }, [internshipId]);

    useEffect(() => {
        fetchInternship();
    }, [fetchInternship]);

    // Pre-fill form with user data
    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                fullName: user.fullName || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const updateForm = (updates: Partial<ApplyFormState>) => {
        setForm(prev => ({ ...prev, ...updates }));
    };

    const handleFileChange = (file: File) => {
        if (file.type !== 'application/pdf') {
            setError('Only PDF files are allowed');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('File size must be less than 5MB');
            return;
        }
        setError(null);
        updateForm({ resumeFile: file });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!internshipId) return;
        if (!form.resumeFile) {
            setError('Please upload your resume');
            return;
        }

        // Validate Phone
        const fullPhone = `${form.countryCode}${form.phone}`;
        const cleanPhone = fullPhone.replace(/\D/g, "");

        if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            setError('Please provide a valid phone number (10-15 digits including country code)');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Get Presigned URL
            setUploading(true);
            const presignedRes = await uploadApi.getPresignedUrl(
                form.resumeFile.name,
                form.resumeFile.type
            );
            const { uploadUrl, key } = presignedRes.data;

            // 2. Upload File
            await uploadApi.uploadFile(uploadUrl, form.resumeFile);
            setUploading(false);

            // 3. Submit Application
            await internshipsApi.applyForInternship(internshipId, {
                fullName: form.fullName,
                email: form.email,
                phone: `${form.countryCode} ${form.phone}`,
                linkedinUrl: form.linkedinUrl,
                githubUrl: form.githubUrl,
                portfolioUrl: form.portfolioUrl,
                coverLetter: form.coverLetter,
                resumeUrl: key
            });

            // Success handled by UI now
            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            setUploading(false);
            setError(err.response?.data?.message || err.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    return {
        internship,
        fetchLoading,
        form,
        updateForm,
        handleFileChange,
        handleSubmit,
        loading,
        uploading,
        error,
        success
    };
};
