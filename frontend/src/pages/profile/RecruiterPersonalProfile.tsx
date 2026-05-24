
import React from 'react';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';
import { useRecruiterPersonalProfile } from '@/hooks/profile/recruiter/useRecruiterPersonalProfile';
import PersonalProfileHeader from '@/components/profile/personal/PersonalProfileHeader';
import PersonalProfileDetails from '@/components/profile/personal/PersonalProfileDetails';
import '@/styles/profile/recruiter-personal-profile.css';

/**
 * Purpose: "The Basic Identity Editor" Page
 * - Provides the UI/Form for editing basic recruiter identity.
 * - Uses useRecruiterPersonalProfile to handle updates via Onboarding APIs.
 */
const RecruiterPersonalProfile: React.FC = () => {
    const {
        user,
        isEditing,
        isSaving,
        formData,
        setIsEditing,
        handleInputChange,
        handleSave,
        handleCancel
    } = useRecruiterPersonalProfile();

    return (
        <div className="recruiter-profile-page">
            <div className="profile-container">
                <RecruiterSidebar />

                <main className="profile-main-content">
                    {/* Header Section */}
                    <PersonalProfileHeader
                        user={user}
                        isEditing={isEditing}
                        onEditClick={() => setIsEditing(true)}
                    />

                    {/* Details Section */}
                    <PersonalProfileDetails
                        user={user}
                        isEditing={isEditing}
                        isSaving={isSaving}
                        formData={formData}
                        onInputChange={handleInputChange}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                </main>
            </div>
        </div>
    );
};

export default RecruiterPersonalProfile;
