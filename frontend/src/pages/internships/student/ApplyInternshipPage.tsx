import { useParams } from 'react-router-dom';
import { StudentDashboardLayout } from '@/components/layout/StudentDashboardLayout';
import { LoadingState } from '@/components/common/LoadingState';
import { ApplyInternshipVisuals } from '@/components/internships/student/ApplyInternshipVisuals';
import { useApplyInternship } from '@/hooks/internships/student/useApplyInternship';
import '@/styles/internships/student/apply-internship.css';

export default function ApplyInternshipPage() {
    const { id } = useParams<{ id: string }>();

    const {
        internship,
        fetchLoading,
        form,
        updateForm,
        handleFileChange,
        handleSubmit,
        loading,
        uploading,
        error: submitError,
        success
    } = useApplyInternship(id);

    if (fetchLoading) {
        return (
            <StudentDashboardLayout>
                <LoadingState fullPage />
            </StudentDashboardLayout>
        );
    }

    return (
        <StudentDashboardLayout>
            <div className="student-details-container">
                <ApplyInternshipVisuals
                    form={form}
                    updateForm={updateForm}
                    onFileChange={handleFileChange}
                    onSubmit={handleSubmit}
                    loading={loading}
                    uploading={uploading}
                    error={submitError}
                    success={success}
                    internshipTitle={internship?.title || 'Internship'}
                />
            </div>
        </StudentDashboardLayout>
    );
}
