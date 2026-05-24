import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { onboardingApi } from '@/api/onboarding.api';

export interface PersonalProfileFormData {
    professionalTitle: string;
    companyName: string;
    city: string;
    state: string;
    companyWebsite: string;
    companyDescription: string;
}

export const useRecruiterPersonalProfile = () => {
    const { user, refreshAuth } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<PersonalProfileFormData>({
        professionalTitle: '',
        companyName: '',
        city: '',
        state: '',
        companyWebsite: '',
        companyDescription: ''
    });

    // Initialize form with user data when needed
    useEffect(() => {
        if (user) {
            setFormData({
                professionalTitle: user.professionalTitle || '',
                companyName: user.companyName || '',
                city: user.city || '',
                state: user.state || '',
                companyWebsite: user.companyWebsite || '',
                companyDescription: user.companyDescription || ''
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            // We need to call multiple endpoints because our onboarding was split
            // 1. Professional Title
            await onboardingApi.saveRecruiterProfessional({ professionalTitle: formData.professionalTitle });

            // 2. Company Details (Name, Location)
            await onboardingApi.saveRecruiterCompany({
                companyName: formData.companyName,
                city: formData.city,
                state: formData.state
            });

            // 3. Description & Website
            await onboardingApi.saveRecruiterDescription({
                companyDescription: formData.companyDescription,
                companyWebsite: formData.companyWebsite
            });

            // 4. Refresh Auth to update UI
            await refreshAuth();
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset form to current user values
        if (user) {
            setFormData({
                professionalTitle: user.professionalTitle || '',
                companyName: user.companyName || '',
                city: user.city || '',
                state: user.state || '',
                companyWebsite: user.companyWebsite || '',
                companyDescription: user.companyDescription || ''
            });
        }
        setIsEditing(false);
    };

    return {
        user,
        isEditing,
        isSaving,
        formData,
        setIsEditing,
        handleInputChange,
        handleSave,
        handleCancel
    };
};
