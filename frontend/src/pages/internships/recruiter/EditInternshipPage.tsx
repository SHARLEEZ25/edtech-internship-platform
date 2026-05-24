import { useParams } from 'react-router-dom';
import RecruiterSidebar from '@/components/dashboard/recruiter/RecruiterSidebar';
import { InternshipFormVisuals } from '@/components/internships/recruiter';
import { useEditInternship } from '@/hooks/internships/recruiter/useEditInternship';
import '@/styles/internships/recruiter/recruiter-internships.css';
import '@/styles/dashboard/recruiter-dashboard.css';

export default function EditInternshipPage() {
    const { id } = useParams<{ id: string }>();
    const {
        formData,
        handleChange,
        handleTypeChange,
        handleDurationChange,
        isCustomDuration,
        handleCustomDurationValueChange,
        handleDurationUnitChange,
        handleStatusSubmit,
        isPaid,
        setIsPaid,
        formError,
        fetching,
        submitting,
        error: pageError,
        navigateBack
    } = useEditInternship(id);

    return (
        <div className="recruiter-dashboard-container">
            <RecruiterSidebar />
            <main className="recruiter-main">
                <div className="int-form-container">
                    <div className="int-form-content">
                        <header className="int-form-header">
                            <h1 className="int-form-title">Edit Internship</h1>
                            <p className="int-form-subtitle">Update the details of your internship posting.</p>
                        </header>

                        {fetching ? (
                            <div className="loading-state">
                                <p>Loading internship details...</p>
                            </div>
                        ) : pageError && !formData.title ? (
                            <div className="error-state">
                                <h2>Error</h2>
                                <p>{pageError}</p>
                                <button onClick={navigateBack}>
                                    Go Back
                                </button>
                            </div>
                        ) : (
                            <>
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
                                    handleCustomDurationValueChange={handleCustomDurationValueChange}
                                    handleDurationUnitChange={handleDurationUnitChange}
                                    handleSubmit={handleStatusSubmit}
                                    onCancel={navigateBack}
                                    isPaid={isPaid}
                                    setIsPaid={setIsPaid}
                                    formError={null}
                                    loading={submitting}
                                    isEdit={true}
                                />
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
