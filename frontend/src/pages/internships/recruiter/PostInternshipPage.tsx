import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';
import { InternshipFormVisuals } from '@/components/internships/recruiter';
import { usePostInternship } from '@/hooks/internships/recruiter/usePostInternship';
import '@/styles/internships/recruiter/recruiter-internships.css';
import '@/styles/dashboard/recruiter-dashboard.css';

export default function PostInternshipPage() {
    const {
        formData,
        handleChange,
        handleTypeChange,
        handleDurationChange,
        isCustomDuration,
        handleStatusSubmit,
        isPaid,
        setIsPaid,
        formError,
        submitting,
        error: pageError,
        navigateBack
    } = usePostInternship();

    return (
        <div className="recruiter-dashboard-container">
            <RecruiterSidebar />
            <main className="recruiter-main">
                <div className="int-form-container">
                    <div className="int-form-content">
                        <header className="int-form-header">
                            <h1 className="int-form-title">Post New Internship</h1>
                            <p className="int-form-subtitle">Fill in the details to find the best talent for your company.</p>
                        </header>

                        {(pageError || formError) && (
                            <div className="error-message" style={{ color: 'red', marginBottom: '1rem', fontWeight: 500 }}>
                                {pageError || formError}
                            </div>
                        )}

                        <InternshipFormVisuals
                            formData={formData}
                            handleChange={handleChange}
                            handleTypeChange={handleTypeChange}
                            handleDurationChange={handleDurationChange}
                            isCustomDuration={isCustomDuration}
                            handleSubmit={handleStatusSubmit}
                            onCancel={navigateBack}
                            isPaid={isPaid}
                            setIsPaid={setIsPaid}
                            formError={null}
                            loading={submitting}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
