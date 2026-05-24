import { Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "@/pages/dashboard/StudentDashboard";
import StudentProfile from "@/pages/profile/StudentProfile";
import RecruiterProfilePage from "@/pages/profile/RecruiterProfilePage";
import RecruiterDashboard from "@/pages/dashboard/RecruiterDashboard";
import RecruiterInternships from "@/pages/internships/recruiter/RecruiterInternships";
import PostInternshipPage from "@/pages/internships/recruiter/PostInternshipPage";
import EditInternshipPage from "@/pages/internships/recruiter/EditInternshipPage";
import InternshipDetailsPage from "@/pages/internships/recruiter/InternshipDetailsPage";
import InternshipApplicationsPage from "@/pages/internships/recruiter/InternshipApplicationsPage";
import AllRecruiterApplicationsPage from "@/pages/internships/recruiter/AllRecruiterApplicationsPage";
import RecruiterApplicationDetailsPage from "@/pages/internships/recruiter/RecruiterApplicationDetailsPage";
import RecruiterViewStudentProfilePage from "@/pages/internships/recruiter/RecruiterViewStudentProfilePage";
import FindInternshipsPage from "@/pages/internships/student/FindInternshipsPage";
import StudentInternshipDetailsPage from "@/pages/internships/student/StudentInternshipDetailsPage";
import CompanyProfilePage from '../pages/internships/student/CompanyProfilePage';
import ApplyInternshipPage from '../pages/internships/student/ApplyInternshipPage';
import SavedInternshipsPage from "@/pages/internships/student/SavedInternshipsPage";
import MyApplicationsPage from '@/pages/internships/student/MyApplicationsPage';
import StudentApplicationDetailsPage from "@/pages/internships/student/StudentApplicationDetailsPage";
import MyInterviewsPage from "@/pages/interviews/student/MyInterviewsPage";
import InterviewDetailsPage from "@/pages/interviews/student/InterviewDetailsPage";
import RecruiterInterviewsPage from "@/pages/interviews/recruiter/RecruiterInterviewsPage";
import ScheduleInterviewPage from "@/pages/interviews/recruiter/ScheduleInterviewPage";
import { useAuth } from "@/context/AuthContext";

export default function DashboardRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="student" element={<StudentDashboard />} />
            <Route path="student/internships" element={<FindInternshipsPage />} />
            <Route path="student/internships/:id" element={<StudentInternshipDetailsPage />} />
            <Route path="student/internships/:id/apply" element={<ApplyInternshipPage />} />
            <Route path="student/saved-internships" element={<SavedInternshipsPage />} />
            <Route path="student/applications" element={<MyApplicationsPage />} />
            <Route path="student/applications/:id" element={<StudentApplicationDetailsPage />} />
            <Route path="student/companies/:recruiterId" element={<CompanyProfilePage />} />
            <Route path="student/profile" element={<StudentProfile />} />
            <Route path="student/interviews" element={<MyInterviewsPage />} />
            <Route path="student/interviews/:id" element={<InterviewDetailsPage />} />
            <Route path="recruiter" element={<RecruiterDashboard />} />
            <Route path="recruiter/profile" element={<RecruiterProfilePage />} />
            <Route path="recruiter/internships" element={<RecruiterInternships />} />
            <Route path="recruiter/internships/new" element={<PostInternshipPage />} />
            <Route path="recruiter/internships/:id" element={<InternshipDetailsPage />} />
            <Route path="recruiter/internships/:id/edit" element={<EditInternshipPage />} />
            <Route path="recruiter/internships/:id/applications" element={<InternshipApplicationsPage />} />
            <Route path="recruiter/applications" element={<AllRecruiterApplicationsPage />} />
            <Route path="recruiter/applications/:id" element={<RecruiterApplicationDetailsPage />} />
            <Route path="recruiter/interviews" element={<RecruiterInterviewsPage />} />
            <Route path="recruiter/interviews/schedule/:applicationId" element={<ScheduleInterviewPage />} />
            <Route path="recruiter/students/:studentId" element={<RecruiterViewStudentProfilePage />} />

            {/* Redirect to appropriate dashboard based on role if just /dashboard is accessed */}
            <Route
                path="/"
                element={
                    user?.role === "RECRUITER"
                        ? <Navigate to="recruiter" replace />
                        : <Navigate to="student" replace />
                }
            />
        </Routes>
    );
}
